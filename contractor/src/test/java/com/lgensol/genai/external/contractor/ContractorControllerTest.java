package com.lgensol.genai.external.contractor;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.ByteArrayOutputStream;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ContractorControllerTest {
  @Autowired private MockMvc mockMvc;

  private static byte[] blankPdfBytes() throws Exception {
    try (PDDocument doc = new PDDocument()) {
      doc.addPage(new PDPage());
      ByteArrayOutputStream out = new ByteArrayOutputStream();
      doc.save(out);
      return out.toByteArray();
    }
  }

  @Test
  void fileContraction_acceptsPdfMultipart() throws Exception {
    MockMultipartFile file = new MockMultipartFile(
        "file",
        "CV1.pdf",
        "application/pdf",
        blankPdfBytes()
    );

    mockMvc.perform(
            multipart("/api/v1/contractor/file_contraction")
                .file(file)
                .param("manager", "JUYA")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.manager").value("JUYA"))
        .andExpect(jsonPath("$.filename").value("CV1.pdf"))
        .andExpect(jsonPath("$.pageCount").value(1))
        .andExpect(jsonPath("$.sha256").isString());
  }
}

