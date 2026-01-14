package com.lgensol.genai.external.contractor.service;

import com.lgensol.genai.external.contractor.dto.FileContractionResponse;
import com.lgensol.genai.external.contractor.util.Sha256;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.regex.Pattern;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileContractionService {
  private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
      MediaType.APPLICATION_PDF_VALUE,
      "application/x-pdf"
  );

  private static final Pattern SPACES = Pattern.compile("[ \\t]+");
  private static final Pattern MANY_NEWLINES = Pattern.compile("\\n{3,}");

  private final long maxUploadBytes;
  private final int maxContractedChars;

  public FileContractionService(
      @Value("${contractor.maxUploadBytes:26214400}") long maxUploadBytes,
      @Value("${contractor.maxContractedChars:4000}") int maxContractedChars
  ) {
    this.maxUploadBytes = maxUploadBytes;
    this.maxContractedChars = maxContractedChars;
  }

  public FileContractionResponse process(String manager, MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new IllegalArgumentException("Uploaded file is empty.");
    }

    String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
    if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
      throw new UnsupportedOperationException("Only PDF files are supported.");
    }

    byte[] bytes;
    try {
      bytes = file.getBytes();
    } catch (Exception e) {
      throw new IllegalArgumentException("Failed to read uploaded file.", e);
    }

    if (bytes.length > maxUploadBytes) {
      throw new IllegalArgumentException("File too large. Max allowed is " + maxUploadBytes + " bytes.");
    }

    String sha256 = Sha256.hex(bytes);

    ExtractResult extracted = extractPdfText(bytes);
    ContractionResult contraction = contractText(extracted.text(), maxContractedChars);

    return new FileContractionResponse(
        manager,
        file.getOriginalFilename(),
        file.getContentType(),
        bytes.length,
        sha256,
        extracted.pageCount(),
        extracted.text(),
        extracted.text().length(),
        contraction.contractedText(),
        contraction.contractedText().length(),
        contraction.wasTruncated()
    );
  }

  private ExtractResult extractPdfText(byte[] pdfBytes) {
    try (PDDocument document = Loader.loadPDF(pdfBytes)) {
      PDFTextStripper stripper = new PDFTextStripper();
      String text = stripper.getText(document);
      if (text == null) text = "";
      text = text.strip();
      int pages = document.getNumberOfPages();
      return new ExtractResult(text, pages);
    } catch (Exception e) {
      throw new IllegalArgumentException("Invalid PDF: " + e.getMessage(), e);
    }
  }

  private ContractionResult contractText(String text, int maxChars) {
    String normalized = SPACES.matcher(text).replaceAll(" ");
    normalized = MANY_NEWLINES.matcher(normalized).replaceAll("\n\n").strip();

    Set<String> seen = new LinkedHashSet<>();
    StringBuilder out = new StringBuilder();
    for (String rawLine : normalized.split("\\R")) {
      String line = rawLine.strip();
      if (line.isEmpty()) continue;
      if (seen.contains(line)) continue;
      seen.add(line);
      if (!out.isEmpty()) out.append('\n');
      out.append(line);
      if (out.length() >= maxChars) break;
    }

    String contracted = out.toString();
    boolean truncated = contracted.length() > maxChars || normalized.length() > contracted.length();
    if (contracted.length() > maxChars) contracted = contracted.substring(0, maxChars);
    return new ContractionResult(contracted, truncated);
  }

  private record ExtractResult(String text, int pageCount) {}

  private record ContractionResult(String contractedText, boolean wasTruncated) {}
}

