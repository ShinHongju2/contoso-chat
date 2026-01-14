from __future__ import annotations

import hashlib
import io
import re
from typing import Any

from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from pypdf import PdfReader

MAX_UPLOAD_BYTES = 25 * 1024 * 1024  # 25MB
MAX_CONTRACTED_CHARS = 4000


def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def extract_pdf_text(pdf_bytes: bytes) -> tuple[str, int]:
    """
    Returns (text, page_count).
    """
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
    except Exception as e:  # pragma: no cover
        raise ValueError(f"Invalid PDF: {e}") from e

    texts: list[str] = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        if page_text:
            texts.append(page_text)

    return ("\n\n".join(texts).strip(), len(reader.pages))


def contract_text(text: str, max_chars: int = MAX_CONTRACTED_CHARS) -> dict[str, Any]:
    """
    A deterministic "contraction" that:
    - normalizes whitespace
    - drops empty lines
    - de-duplicates identical lines (preserving first occurrence)
    - truncates to max_chars
    """
    normalized = re.sub(r"[ \t]+", " ", text)
    normalized = re.sub(r"\n{3,}", "\n\n", normalized).strip()

    seen: set[str] = set()
    lines_out: list[str] = []
    for raw_line in normalized.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line in seen:
            continue
        seen.add(line)
        lines_out.append(line)

    deduped = "\n".join(lines_out)
    truncated = deduped[:max_chars]
    was_truncated = len(deduped) > max_chars

    return {
        "contracted_text": truncated,
        "contracted_length": len(truncated),
        "was_truncated": was_truncated,
    }


app = FastAPI(
    title="Contractor File Contraction API",
    version="0.1.0",
)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/contractor/file_contraction")
async def file_contraction(
    manager: str = Query(..., min_length=1, max_length=100),
    file: UploadFile = File(...),
) -> dict[str, Any]:
    content_type = (file.content_type or "").lower()
    if content_type not in {"application/pdf", "application/x-pdf"}:
        raise HTTPException(status_code=415, detail="Only PDF files are supported.")

    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(pdf_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max allowed is {MAX_UPLOAD_BYTES} bytes.",
        )

    file_hash = _sha256(pdf_bytes)

    try:
        extracted_text, page_count = extract_pdf_text(pdf_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

    contraction = contract_text(extracted_text, max_chars=MAX_CONTRACTED_CHARS)

    return {
        "manager": manager,
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": len(pdf_bytes),
        "sha256": file_hash,
        "page_count": page_count,
        "extracted_text": extracted_text,
        "extracted_length": len(extracted_text),
        **contraction,
    }

