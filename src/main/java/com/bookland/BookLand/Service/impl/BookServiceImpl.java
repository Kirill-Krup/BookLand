package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.BookDTOs.BookCreateDTO;
import com.bookland.BookLand.DTO.BookDTOs.BookDTO;
import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import com.bookland.BookLand.Mapper.BookMapper;
import com.bookland.BookLand.Model.Book;
import com.bookland.BookLand.Repository.AuthorRepository;
import com.bookland.BookLand.Repository.BookRepository;
import com.bookland.BookLand.Repository.GenreRepository;
import com.bookland.BookLand.Service.BookService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BookServiceImpl implements BookService {

  private BookMapper bookMapper;
  private BookRepository bookRepository;
  private final AuthorRepository authorRepository;
  private final GenreRepository genreRepository;

  @Override
  public List<BookSimpleDTO> getNewBooks(){
    return bookRepository.findFirst3ByOrderByCreatedAtDesc().stream().map(bookMapper::toSimpleDto).collect(Collectors.toList());
  }

  @Override
  public List<BookDTO> getAllBooks(){
    return bookRepository.findAll().stream().map(bookMapper::toDto).collect(Collectors.toList());
  }

  @Override
  public BookDTO createNewBook(BookCreateDTO bookCreateDTO) {
    Book book = bookMapper.toEntity(bookCreateDTO);
    book.setGenre(genreRepository.getGenreById((bookCreateDTO.getGenreId())));
    book.setAuthor(authorRepository.findAuthorById(bookCreateDTO.getAuthorId()));
    return bookMapper.toDto(bookRepository.save(book));
  }

  @Transactional
  @Override
  public void deleteBookById(Long id) {
    if (bookRepository.findById(id).isPresent()) {
      bookRepository.deleteBookById(id);
    }
    else {
      System.err.println("ERROR: Book not found");
    }
  }

  @Override
  public BookDTO updateBook(Long id, BookCreateDTO bookUpdateDTO) {
    Book book = bookRepository.findBookById(id);
    book.setTitle(bookUpdateDTO.getTitle());
    book.setIsbn(bookUpdateDTO.getIsbn());
    book.setDescription(bookUpdateDTO.getDescription());
    book.setPrice(bookUpdateDTO.getPrice());
    book.setPublicationDate(bookUpdateDTO.getPublicationDate());
    book.setPages(bookUpdateDTO.getPages());
    book.setCoverImageUrl(bookUpdateDTO.getCoverImageUrl());
    book.setPublisherName(bookUpdateDTO.getPublisherName());
    book.setAuthor(authorRepository.findAuthorById(bookUpdateDTO.getAuthorId()));
    book.setGenre(genreRepository.findGenreById(bookUpdateDTO.getGenreId()));
    return bookMapper.toDto(bookRepository.save(book));
  }

  @Override
  public List<BookSimpleDTO> getFivePopularBooks() {
    List<Book> randomBooks = bookRepository.findRandomBooks();
    return randomBooks.stream()
        .map(bookMapper::toSimpleDto)
        .collect(Collectors.toList());
  }

}
