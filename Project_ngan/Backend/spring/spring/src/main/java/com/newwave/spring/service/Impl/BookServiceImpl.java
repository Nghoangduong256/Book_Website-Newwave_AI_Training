package com.newwave.spring.service.Impl;

import com.newwave.spring.dto.BookRequest;
import com.newwave.spring.dto.BookResponse;
import com.newwave.spring.entity.Book;
import com.newwave.spring.repository.BookRepository;
import com.newwave.spring.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    @Override
    public List<BookResponse> getAll() {
        return bookRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BookResponse getById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return toResponse(book);
    }

    @Override
    public BookResponse create(BookRequest request) {
        Book book = new Book();
        applyRequest(book, request);
        return toResponse(bookRepository.save(book));    }

    @Override
    public BookResponse update(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        applyRequest(book, request);
        return toResponse(bookRepository.save(book));    }

    @Override
    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found");
        }
        bookRepository.deleteById(id);
    }

    // ===== Mapping =====
    private void applyRequest(Book book, BookRequest request) {
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setPublishYear(request.getPublishYear());
        book.setTags(request.getTags());
        book.setPdfUrl(request.getPdfUrl());
        book.setHasLocalFile(request.isHasLocalFile());
    }

    private BookResponse toResponse(Book book) {
        BookResponse res = new BookResponse();
        res.setId(book.getId());
        res.setTitle(book.getTitle());
        res.setAuthor(book.getAuthor());
        res.setPublishYear(book.getPublishYear());
        res.setTags(book.getTags());
        res.setPdfUrl(book.getPdfUrl());
        res.setHasLocalFile(book.isHasLocalFile());
        res.setCreatedAt(book.getCreatedAt());
        res.setUpdatedAt(book.getUpdatedAt());
        return res;
    }
}

