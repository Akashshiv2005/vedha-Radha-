"""
Standalone MinIO Bucket Creation Script.
Vedha Radha Thangamaaligai — Jewellery E-commerce Platform.

Features:
  - Connects to MinIO Object Storage using credentials from .env.
  - Checks if the specified bucket exists.
  - Automatically creates the bucket if it does not exist.
  - Configures default read-access policy for public product imagery.
  - Lists all active buckets for clear visual confirmation.

Usage:
  python scripts/create_minio_bucket.py
  python scripts/create_minio_bucket.py --bucket custom-bucket-name
"""

import argparse
import json
import os
import sys
from pathlib import Path

# Add backend directory to sys.path so app modules can be imported
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from minio import Minio
from minio.error import S3Error
from app.core.config import settings


def get_minio_client() -> Minio:
    """Initialize MinIO client from application settings."""
    return Minio(
        endpoint=settings.MINIO_ENDPOINT,
        access_key=settings.MINIO_ACCESS_KEY,
        secret_key=settings.MINIO_SECRET_KEY,
        secure=settings.MINIO_SECURE,
        region=settings.MINIO_REGION or None,
    )


def set_public_read_policy(client: Minio, bucket_name: str) -> bool:
    """
    Set a read-only bucket policy allowing anonymous HTTP GET requests
    for product images while keeping write operations secured.
    """
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"AWS": ["*"]},
                "Action": ["s3:GetBucketLocation", "s3:ListBucket"],
                "Resource": [f"arn:aws:s3:::{bucket_name}"],
            },
            {
                "Effect": "Allow",
                "Principal": {"AWS": ["*"]},
                "Action": ["s3:GetObject"],
                "Resource": [f"arn:aws:s3:::{bucket_name}/*"],
            },
        ],
    }
    try:
        client.set_bucket_policy(bucket_name, json.dumps(policy))
        print(f"[INFO] Applied public read policy to bucket '{bucket_name}'.")
        return True
    except Exception as e:
        print(f"[WARN] Could not set public read policy: {e}")
        return False


def create_bucket(bucket_name: Optional[str] = None, make_public: bool = True) -> bool:
    """
    Check connectivity and create the target MinIO bucket if it does not exist.
    """
    target_bucket = (bucket_name or settings.MINIO_BUCKET).strip()

    print("=" * 70)
    print("VEDHA RADHA THANGAMAALIGAI — MINIO BUCKET CREATION")
    print("=" * 70)
    print(f"[INFO] MinIO Endpoint:  {settings.MINIO_ENDPOINT}")
    print(f"[INFO] Access Key:      {settings.MINIO_ACCESS_KEY}")
    print(f"[INFO] Target Bucket:   {target_bucket}")
    print(f"[INFO] Secure (SSL):    {settings.MINIO_SECURE}")
    print("=" * 70)

    try:
        client = get_minio_client()
    except Exception as e:
        print(f"[ERROR] Failed to initialize MinIO client: {e}")
        return False

    # Check connection by listing buckets or pinging
    try:
        exists = client.bucket_exists(target_bucket)
    except Exception as e:
        print(f"[ERROR] Failed to connect to MinIO at {settings.MINIO_ENDPOINT}: {e}")
        print("[HINT] Ensure MinIO server is running (e.g. minio server <data_folder>).")
        return False

    if exists:
        print(f"[OK] Bucket '{target_bucket}' already exists!")
    else:
        print(f"[ACTION] Bucket '{target_bucket}' does not exist. Creating now...")
        try:
            client.make_bucket(target_bucket)
            print(f"[SUCCESS] Bucket '{target_bucket}' was created successfully!")
        except S3Error as e:
            print(f"[ERROR] MinIO S3 error while creating bucket: {e}")
            return False
        except Exception as e:
            print(f"[ERROR] Unexpected error while creating bucket: {e}")
            return False

    # Apply public read policy if requested
    if make_public:
        set_public_read_policy(client, target_bucket)

    # List all buckets for confirmation
    try:
        buckets = [b.name for b in client.list_buckets()]
        print("-" * 70)
        print(f"[INFO] Active MinIO Buckets ({len(buckets)}):")
        for b in sorted(buckets):
            marker = " -> [TARGET]" if b == target_bucket else ""
            print(f"       • {b}{marker}")
        print("=" * 70)
    except Exception as e:
        print(f"[WARN] Could not retrieve bucket list: {e}")

    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Dedicated standalone MinIO bucket creation tool for Vedha Radha."
    )
    parser.add_argument(
        "--bucket",
        type=str,
        default=None,
        help=f"Bucket name to create (defaults to MINIO_BUCKET in .env: '{settings.MINIO_BUCKET}')",
    )
    parser.add_argument(
        "--no-public-policy",
        action="store_false",
        dest="make_public",
        help="Skip applying public read policy to the bucket.",
    )
    args = parser.parse_args()

    success = create_bucket(bucket_name=args.bucket, make_public=args.make_public)
    if not success:
        sys.exit(1)
