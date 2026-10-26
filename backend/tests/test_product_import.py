import io
import uuid
import pytest
import openpyxl


def test_import_unauthorized(client):
    """Import endpoint requires admin authorization."""
    csv_content = b"sku,name,category,price\nIMP-01,Test,Gold,100\n"
    files = {"file": ("test.csv", io.BytesIO(csv_content), "text/csv")}
    res = client.post("/api/admin/products/import", files=files, data={"dry_run": "true"})
    assert res.status_code == 401


def test_import_missing_headers(client, auth_headers):
    """CSV missing required headers is rejected with 400 Bad Request."""
    csv_content = b"title,cost,tag\nTest Item,500,Gold\n"
    files = {"file": ("invalid_headers.csv", io.BytesIO(csv_content), "text/csv")}
    res = client.post("/api/admin/products/import", files=files, data={"dry_run": "true"}, headers=auth_headers)
    assert res.status_code == 400
    assert "Missing required headers" in res.text


def test_import_dry_run_makes_no_db_changes(client, auth_headers):
    """Dry run validates rows and reports counts without persisting to database."""
    unique_sku = f"DRY-{uuid.uuid4().hex[:6].upper()}"
    csv_content = f"sku,name,category,price,stock_quantity\n{unique_sku},Dry Run Necklace,Gold Jewellery,95000,1\n".encode("utf-8")
    files = {"file": ("dry_run_test.csv", io.BytesIO(csv_content), "text/csv")}

    res = client.post("/api/admin/products/import", files=files, data={"dry_run": "true"}, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["dry_run"] is True
    assert data["total_rows"] == 1
    assert data["valid_rows"] == 1
    assert data["invalid_rows"] == 0
    assert data["created_count"] == 0

    # Ensure item was NOT inserted into database
    get_res = client.get(f"/api/admin/products/{unique_sku}", headers=auth_headers)
    assert get_res.status_code == 404


def test_import_actual_csv_success(client, auth_headers):
    """Actual import mode inserts all valid products into database."""
    sku1 = f"ACT1-{uuid.uuid4().hex[:6].upper()}"
    sku2 = f"ACT2-{uuid.uuid4().hex[:6].upper()}"
    csv_text = (
        f"sku,name,category,sub_category,price,item_type,stock_quantity\n"
        f"{sku1},Actual Silver Toe Ring,Silver Jewellery,Toe Rings,3200,regular,5\n"
        f"{sku2},Antique Gold Jhumka,Gold Jewellery,Earrings,62000,unique,1\n"
    )
    files = {"file": ("actual_import.csv", io.BytesIO(csv_text.encode("utf-8")), "text/csv")}

    res = client.post("/api/admin/products/import", files=files, data={"dry_run": "false"}, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["dry_run"] is False
    assert data["created_count"] == 2
    assert data["invalid_rows"] == 0

    # Verify both products are queryable in PostgreSQL
    p1 = client.get(f"/api/admin/products/{sku1}", headers=auth_headers)
    assert p1.status_code == 200
    assert p1.json()["name"] == "Actual Silver Toe Ring"
    assert p1.json()["stockQty"] == 5

    p2 = client.get(f"/api/admin/products/{sku2}", headers=auth_headers)
    assert p2.status_code == 200
    assert p2.json()["name"] == "Antique Gold Jhumka"
    assert p2.json()["isUnique"] is True


def test_import_detects_duplicate_skus_in_file(client, auth_headers):
    """File containing duplicate SKUs reports error with row numbers."""
    dup_sku = f"DUP-{uuid.uuid4().hex[:6].upper()}"
    csv_text = (
        f"sku,name,category,price\n"
        f"{dup_sku},First Item,Gold Jewellery,5000\n"
        f"{dup_sku},Second Item with Same SKU,Gold Jewellery,6000\n"
    )
    files = {"file": ("dup_test.csv", io.BytesIO(csv_text.encode("utf-8")), "text/csv")}
    res = client.post("/api/admin/products/import", files=files, data={"dry_run": "true"}, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is False
    assert data["invalid_rows"] >= 1
    assert any("Duplicate SKU" in err["reason"] for err in data["errors"])


def test_import_detects_existing_sku_and_protects_sold_items(client, auth_headers):
    """Import rejects attempts to overwrite existing items and protects reserved/sold items."""
    # SA-001 is a reserved unique item in the seed
    csv_text = "sku,name,category,price,status\nSA-001,Overwrite Attempt,Silver Jewellery,999,available\n"
    files = {"file": ("conflict_test.csv", io.BytesIO(csv_text.encode("utf-8")), "text/csv")}
    res = client.post("/api/admin/products/import", files=files, data={"dry_run": "true"}, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is False
    assert data["invalid_rows"] == 1
    err = data["errors"][0]
    assert "SA-001" in err["reason"]
    assert "protected status" in err["reason"] or "already exists" in err["reason"]


def test_import_invalid_numeric_fields(client, auth_headers):
    """Negative prices or invalid numbers report row-level errors."""
    sku = f"NUM-{uuid.uuid4().hex[:6].upper()}"
    csv_text = f"sku,name,category,price,stock_quantity\n{sku},Bad Price Item,Silver,-500,not_a_number\n"
    files = {"file": ("bad_num.csv", io.BytesIO(csv_text.encode("utf-8")), "text/csv")}
    res = client.post("/api/admin/products/import", files=files, data={"dry_run": "true"}, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is False
    assert data["invalid_rows"] >= 1


def test_import_xlsx_file_support(client, auth_headers):
    """Excel (.xlsx) files are parsed and imported accurately."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(["sku", "name", "category", "price", "stock_quantity"])
    xlsx_sku = f"XLSX-{uuid.uuid4().hex[:6].upper()}"
    ws.append([xlsx_sku, "Excel Imported Bracelet", "Gold Jewellery", 42000, 2])

    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)

    files = {"file": ("test_import.xlsx", stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    res = client.post("/api/admin/products/import", files=files, data={"dry_run": "false"}, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["created_count"] == 1

    # Verify created product
    get_res = client.get(f"/api/admin/products/{xlsx_sku}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Excel Imported Bracelet"
