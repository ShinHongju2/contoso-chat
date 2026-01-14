import io

from fastapi.testclient import TestClient
from pypdf import PdfWriter

from contractor_api.app import app


def _make_pdf_bytes() -> bytes:
    writer = PdfWriter()
    writer.add_blank_page(width=300, height=300)
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()


def test_file_contraction_happy_path_blank_pdf() -> None:
    client = TestClient(app)
    pdf_bytes = _make_pdf_bytes()

    files = {"file": ("CV1.pdf", pdf_bytes, "application/pdf")}
    resp = client.post("/api/v1/contractor/file_contraction?manager=JUYA", files=files)
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["manager"] == "JUYA"
    assert body["filename"] == "CV1.pdf"
    assert body["page_count"] == 1
    assert isinstance(body["sha256"], str) and len(body["sha256"]) == 64

