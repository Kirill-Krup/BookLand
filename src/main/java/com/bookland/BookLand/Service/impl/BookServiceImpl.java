package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.BookDTOs.BookDTO;
import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import com.bookland.BookLand.Mapper.BookMapper;
import com.bookland.BookLand.Repository.BookRepository;
import com.bookland.BookLand.Service.BookService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class BookServiceImpl implements BookService {
  private BookMapper bookMapper;
  private BookRepository bookRepository;

  public BookServiceImpl(BookMapper bookMapper, BookRepository bookRepository) {
    this.bookMapper = bookMapper;
    this.bookRepository = bookRepository;
  }

  public List<BookSimpleDTO> getNewBooks(){
    List<BookSimpleDTO> bookSimpleDTOs = bookRepository.findFirst3ByOrderByCreatedAtDesc().stream().map(bookMapper::toSimpleDto).collect(Collectors.toList());
    return bookSimpleDTOs;
  }

  public List<BookDTO> getAllBooks(){
    List<BookDTO> allBooks= bookRepository.findAll().stream().map(bookMapper::toDto).collect(Collectors.toList());
    return allBooks;
  }

}
