package com.newwave.spring.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class BookRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String author;

    private Integer publishYear;

    private String tags;

    private String pdfUrl;

    private boolean hasLocalFile;

    // getters & setters
}
