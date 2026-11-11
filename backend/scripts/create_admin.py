#!/usr/bin/env python3
"""
Bootstrap CLI script to safely create the initial administrator in PostgreSQL.

Usage:
    python scripts/create_admin.py
    python scripts/create_admin.py --username superadmin --email super@vedaradha.com --password mypass
"""

import argparse
import sys
import os
from pathlib import Path
import getpass

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import SessionLocal, check_db_connection
from app.models.admin_user import AdminUser
from sqlalchemy import or_, func


def main():
    parser = argparse.ArgumentParser(description="Create or verify an admin user in PostgreSQL.")
    parser.add_argument("--username", help="Admin username", default=None)
    parser.add_argument("--email", help="Admin email address", default=None)
    parser.add_argument("--password", help="Admin password", default=None)
    parser.add_argument("--full-name", help="Admin display name", default=None)
    parser.add_argument("--superuser", action="store_true", default=True, help="Grant superuser privileges")
    args = parser.parse_args()

    print("================================================================")
    print(" VEDHA RADHA THANGAMAALIGAI - ADMIN ACCOUNT SETUP")
    print("================================================================")

    # 1. Test database connection
    is_connected, msg = check_db_connection()
    if not is_connected:
        print(f"[ERROR] Database connection failed: {msg}")
        print("Please check that PostgreSQL is running and credentials in .env are correct.")
        sys.exit(1)

    print("[OK] Connected to PostgreSQL database.")

    # 2. Resolve credentials
    username = (
        args.username
        or os.getenv("ADMIN_BOOTSTRAP_USERNAME")
        or settings.ADMIN_BOOTSTRAP_USERNAME
        or input("Enter admin username: ").strip()
    )

    email = (
        args.email
        or os.getenv("ADMIN_BOOTSTRAP_EMAIL")
        or settings.ADMIN_BOOTSTRAP_EMAIL
        or input("Enter admin email: ").strip()
    )

    password = args.password or os.getenv("ADMIN_BOOTSTRAP_PASSWORD") or settings.ADMIN_BOOTSTRAP_PASSWORD

    if not password:
        password = getpass.getpass("Enter admin password: ").strip()

    full_name = (
        args.full_name
        or os.getenv("ADMIN_BOOTSTRAP_FULL_NAME")
        or settings.ADMIN_BOOTSTRAP_FULL_NAME
        or "Administrator"
    )

    if not username or not email or not password:
        print("[ERROR] Username, email, and password must not be empty.")
        sys.exit(1)

    # 3. Check for existing user
    db = SessionLocal()
    try:
        existing = (
            db.query(AdminUser)
            .filter(
                or_(
                    func.lower(AdminUser.username) == username.lower(),
                    func.lower(AdminUser.email) == email.lower(),
                )
            )
            .first()
        )

        if existing:
            print(f"[NOTICE] Administrator '{existing.username}' (email: '{existing.email}') already exists.")
            print(f"         ID: {existing.id} | Superuser: {existing.is_superuser} | Active: {existing.is_active}")
            print("         Existing account will NOT be overwritten.")
            return

        # 4. Create new administrator
        hashed_password = hash_password(password)
        admin = AdminUser(
            username=username,
            email=email,
            password_hash=hashed_password,
            full_name=full_name,
            is_active=True,
            is_superuser=args.superuser,
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("[SUCCESS] Initial administrator created successfully!")
        print(f"         Username:   {admin.username}")
        print(f"         Email:      {admin.email}")
        print(f"         Full Name:  {admin.full_name}")
        print(f"         User ID:    {admin.id}")
        print(f"         Superuser:  {admin.is_superuser}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
