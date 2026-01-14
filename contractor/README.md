## contractor (Spring Boot)

IntelliJ에서 `contractor/pom.xml`을 **Open as Project**로 열면 됩니다.

### 실행

```bash
cd contractor
mvn test
mvn spring-boot:run
```

기본 포트는 `8000`입니다. (`contractor/src/main/resources/application.yml`)

### 호출 (질문에 주신 curl 기반)

```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/contractor/file_contraction?manager=JUYA' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@CV1.pdf;type=application/pdf'
```

