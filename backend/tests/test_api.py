import io

MIN_PDF = (
    b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
    b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
    b"3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\n"
    b"xref\n0 4\n0000000000 65535 f \ntrailer<</Root 1 0 R/Size 4>>\n%%EOF\n"
)


def test_health_ok(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_list_server_tools(client):
    res = client.get("/api/tools")
    assert res.status_code == 200
    assert "ocr" in res.json()["server_tools"]


def test_unknown_tool_404(client):
    res = client.post(
        "/api/tools/nope",
        files=[("files", ("a.pdf", io.BytesIO(MIN_PDF), "application/pdf"))],
        data={"params": "{}"},
    )
    assert res.status_code == 404


def test_rejects_non_pdf(client):
    res = client.post(
        "/api/tools/ocr",
        files=[("files", ("a.pdf", io.BytesIO(b"not a pdf"), "application/pdf"))],
        data={"params": "{}"},
    )
    assert res.status_code == 400
    assert res.json()["code"] == "not_pdf"


def test_bad_file_count(client):
    res = client.post(
        "/api/tools/ocr",
        files=[
            ("files", ("a.pdf", io.BytesIO(MIN_PDF), "application/pdf")),
            ("files", ("b.pdf", io.BytesIO(MIN_PDF), "application/pdf")),
        ],
        data={"params": "{}"},
    )
    assert res.status_code == 400
    assert res.json()["code"] == "bad_count"


def test_no_temp_dirs_leak(client, tmp_path, monkeypatch):
    import tempfile
    import os

    monkeypatch.setattr(tempfile, "tempdir", str(tmp_path))
    client.post(
        "/api/tools/ocr",
        files=[("files", ("a.pdf", io.BytesIO(b"not a pdf"), "application/pdf"))],
        data={"params": "{}"},
    )
    leftovers = [n for n in os.listdir(tmp_path) if n.startswith("pdforge-")]
    assert leftovers == []
