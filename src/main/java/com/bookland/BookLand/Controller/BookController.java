package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.BookDTOs.BookDTO;
import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import com.bookland.BookLand.Service.BookService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/books")
public class BookController {
  private final BookService bookService;

  public BookController(BookService bookService) {
    this.bookService = bookService;
  }

  /**
   * returns 3 new books
   * for home page
   **/
  @GetMapping("/threeNewBooks")
  public List<BookSimpleDTO> getThreeNewBooks(){
    return bookService.getNewBooks();
  }

  @GetMapping("/getAllBooks")
  public List<BookDTO> getAllBooks(){
    return bookService.getAllBooks();
  }
}
