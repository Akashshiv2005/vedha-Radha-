import io
import logging
import uuid
from datetime import timedelta
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

from fastapi import HTTPException, status
from minio import Minio
from minio.error import S3Error
from PIL import Image, UnidentifiedImageError
from sqlalchemy.orm import Session

from ..core.config import settings

logger = logging.getLogger("vedharadha_minio")

# Allowed extensions and MIME types for jewellery product images
ALLOWED_EXTENSIONS: Dict[str, str] = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
}

PIL_FORMAT_MAPPING: Dict[str, Tuple[str, str]] = {
    "JPEG": ("image/jpeg", ".jpg"),
    "PNG": ("image/png", ".png"),
    "WEBP": ("image/webp", ".webp"),
}


class MinioService:
    """
    Reusable, production-oriented MinIO Object Storage Client Service.
    Maintains a single persistent connection to MinIO for product images.
    """

    def __init__(self) -> None:
        self._client: Optional[Minio] = None
        self._endpoint = settings.MINIO_ENDPOINT
        self._bucket = settings.MINIO_BUCKET
        self._secure = settings.MINIO_SECURE
        self._region = settings.MINIO_REGION

    def get_client(self) -> Minio:
        """Lazily initialize and return the reusable Minio client instance."""
        if self._client is None:
            self._client = Minio(
                endpoint=self._endpoint,
                access_key=settings.MINIO_ACCESS_KEY,
                secret_key=settings.MINIO_SECRET_KEY,
                secure=self._secure,
                region=self._region,
            )
        return self._client

    def check_connection(self) -> Dict[str, Any]:
        """
        Verify MinIO connectivity and ensure the target product bucket exists.
        Creates the bucket automatically if configured to do so.
        """
        try:
            client = self.get_client()
            bucket_exists = client.bucket_exists(self._bucket)
            if not bucket_exists and settings.MINIO_AUTO_CREATE_BUCKET:
                logger.info("MinIO bucket '%s' does not exist. Creating now...", self._bucket)
                client.make_bucket(self._bucket)
                bucket_exists = True

            return {
                "connected": True,
                "bucket": self._bucket,
                "bucket_exists": bucket_exists,
            }
        except Exception as e:
            logger.error("MinIO connectivity check failed: %s", str(e))
            return {
                "connected": False,
                "bucket": self._bucket,
                "bucket_exists": False,
                "error": "Storage service unreachable",
            }

    def validate_image_file(self, content: bytes, filename: str) -> Tuple[str, str]:
        """
        Thoroughly validate image file extension, actual file content,
        and decode headers with Pillow to prevent spoofed/malformed uploads.
        """
        # 1. File size checks
        if len(content) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"success": False, "error": "Uploaded image file is empty."},
            )

        if len(content) > settings.MAX_IMAGE_UPLOAD_BYTES:
            max_mb = settings.MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024)
            size_mb = len(content) / (1024 * 1024)
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail={
                    "success": False,
                    "error": f"Image file size ({size_mb:.2f} MB) exceeds maximum allowed limit of {max_mb:.0f} MB.",
                },
            )

        # 2. File extension check
        ext = Path(filename or "").suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            allowed_list = ", ".join(ALLOWED_EXTENSIONS.keys())
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "error": f"Unsupported file extension '{ext}'. Allowed extensions are: {allowed_list}.",
                },
            )

        # 3. Decode image and verify format using Pillow
        try:
            with Image.open(io.BytesIO(content)) as img:
                img.verify()
                format_name = (img.format or "").upper()

                if format_name not in PIL_FORMAT_MAPPING:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail={
                            "success": False,
                            "error": f"Invalid image format '{format_name}'. Only JPEG, PNG, and WebP are allowed.",
                        },
                    )

                content_type, canonical_ext = PIL_FORMAT_MAPPING[format_name]
        except (UnidentifiedImageError, OSError, SyntaxError) as err:
            logger.warning("Rejected invalid image upload '%s': %s", filename, err)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "error": "Uploaded file is corrupted or not a valid image.",
                },
            )

        return content_type, canonical_ext

    def upload_image(self, content: bytes, original_filename: str) -> Dict[str, Any]:
        """
        Validate, name with collision-resistant UUID, and upload image to MinIO.
        Returns the persistent object key and a temporary presigned browser URL.
        """
        content_type, canonical_ext = self.validate_image_file(content, original_filename)

        # Generate collision-resistant object key (never use raw user filename)
        object_key = f"products/{uuid.uuid4()}{canonical_ext}"

        try:
            client = self.get_client()
            # Ensure bucket exists
            if not client.bucket_exists(self._bucket):
                if settings.MINIO_AUTO_CREATE_BUCKET:
                    client.make_bucket(self._bucket)
                else:
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail={"success": False, "error": f"Storage bucket '{self._bucket}' does not exist."},
                    )

            client.put_object(
                bucket_name=self._bucket,
                object_name=object_key,
                data=io.BytesIO(content),
                length=len(content),
                content_type=content_type,
            )

            # Generate presigned browser URL for immediate display
            presigned_url = self.get_presigned_url(object_key)

            return {
                "success": True,
                "object_key": object_key,
                "image_url": presigned_url,
                "content_type": content_type,
                "size": len(content),
            }
        except S3Error as e:
            logger.error("MinIO S3 error during image upload: %s", str(e))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={"success": False, "error": "Storage error while persisting image file."},
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error("Unexpected error during MinIO upload: %s", str(e))
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail={"success": False, "error": "Object storage service is currently unavailable."},
            )

    def get_presigned_url(
        self, object_key: Optional[str], expires_seconds: Optional[int] = None
    ) -> str:
        """
        Generate short-lived presigned GET URL for an image object key.
        Preserves legacy static asset paths and absolute HTTP URLs untouched.
        """
        if not object_key:
            return "/images/neutral_product_placeholder.svg"

        # Already an absolute HTTP/HTTPS URL or legacy relative path
        if (
            object_key.startswith("http://")
            or object_key.startswith("https://")
            or object_key.startswith("/images/")
        ):
            return object_key

        expiry = timedelta(
            seconds=expires_seconds or settings.MINIO_PRESIGNED_EXPIRY_SECONDS
        )

        try:
            client = self.get_client()
            return client.presigned_get_object(
                bucket_name=self._bucket,
                object_name=object_key,
                expires=expiry,
            )
        except Exception as e:
            logger.warning("Failed to generate presigned URL for key '%s': %s", object_key, e)
            # Safe fallback: return object key or default placeholder
            return f"http://{self._endpoint}/{self._bucket}/{object_key}"

    def delete_object_if_unreferenced(
        self,
        object_key: Optional[str],
        db: Session,
        exclude_product_id: Optional[uuid.UUID] = None,
    ) -> bool:
        """
        Safely remove an object from MinIO only if no other active product references it.
        Protects shared image references and historical records.
        """
        if not object_key or not object_key.startswith("products/"):
            return False

        try:
            from ..models.product import Product

            # Query database for other products referencing this object_key
            query = db.query(Product).filter(Product.image_url == object_key)
            if exclude_product_id is not None:
                query = query.filter(Product.id != exclude_product_id)

            referencing_count = query.count()
            if referencing_count > 0:
                logger.info(
                    "Image '%s' is shared by %d other product(s); preserving in storage.",
                    object_key,
                    referencing_count,
                )
                return False

            client = self.get_client()
            client.remove_object(self._bucket, object_key)
            logger.info("Successfully deleted unreferenced image '%s' from MinIO.", object_key)
            return True
        except Exception as e:
            logger.warning("Error during safe image deletion for '%s': %s", object_key, e)
            return False


# Reusable singleton instance
minio_service = MinioService()
