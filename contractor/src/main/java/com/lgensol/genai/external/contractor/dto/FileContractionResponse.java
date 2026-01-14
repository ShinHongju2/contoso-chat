package com.lgensol.genai.external.contractor.dto;

public record FileContractionResponse(
    String manager,
    String filename,
    String contentType,
    long sizeBytes,
    String sha256,
    int pageCount,
    String extractedText,
    int extractedLength,
    String contractedText,
    int contractedLength,
    boolean wasTruncated
) {}

