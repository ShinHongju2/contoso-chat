## Contractor File Contraction API

### 로컬 실행

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r contractor_api/requirements.txt
uvicorn contractor_api.app:app --host 0.0.0.0 --port 8000
```

### 호출 예시 (요청하신 curl 형태)

```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/contractor/file_contraction?manager=JUYA' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@CV1.pdf;type=application/pdf'
```

### 응답

- `extracted_text`: PDF에서 추출한 원문 텍스트
- `contracted_text`: 공백 정리 + 중복 라인 제거 + 길이 제한(기본 4000자)한 축약 텍스트
