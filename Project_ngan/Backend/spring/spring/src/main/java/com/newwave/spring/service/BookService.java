package com.newwave.spring.service;

import com.newwave.spring.dto.BookRequest;
import com.newwave.spring.dto.BookResponse;

import java.util.List;

public interface BookService {

    List<BookResponse> getAll();

    BookResponse getById(Long id);

    BookResponse create(BookRequest request);

    BookResponse update(Long id, BookRequest request);

    void delete(Long id);
}
