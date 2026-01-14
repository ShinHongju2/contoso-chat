package com.lgensol.genai.external.contractor.controller;

import com.lgensol.genai.external.contractor.dto.FileContractionResponse;
import com.lgensol.genai.external.contractor.service.FileContractionService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/contractor")
public class ContractorController {
  private final FileContractionService service;

  public ContractorController(FileContractionService service) {
    this.service = service;
  }

  @PostMapping(
      value = "/file_contraction",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE
  )
  public FileContractionResponse fileContraction(
      @RequestParam("manager") @NotBlank String manager,
      @RequestParam("file") MultipartFile file
  ) {
    return service.process(manager, file);
  }
}

