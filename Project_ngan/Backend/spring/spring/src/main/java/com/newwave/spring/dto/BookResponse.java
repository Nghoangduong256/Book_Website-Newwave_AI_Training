package com.newwave.spring.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@RequiredArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private Integer publishYear;
    private String tags;
    private String pdfUrl;
    private boolean hasLocalFile;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // getters & setters
}
