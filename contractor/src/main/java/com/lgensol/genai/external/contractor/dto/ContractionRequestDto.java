package com.lgensol.genai.external.contractor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContractionRequestDto {

  @NotBlank
  @Size(max = 100)
  private String manager; // 담당자 명(100)

  @NotNull
  private MultipartFile file; // FILE_BINARY_DATA: 이력서 파일 (Binary Stream)
}

