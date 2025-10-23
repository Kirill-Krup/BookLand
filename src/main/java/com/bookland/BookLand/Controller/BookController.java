package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.BookDTOs.BookCreateDTO;
import com.bookland.BookLand.DTO.BookDTOs.BookDTO;
import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import com.bookland.BookLand.Service.BookService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  @PostMapping("/createBook")
  public ResponseEntity<BookDTO> createBook(@RequestBody BookCreateDTO bookCreateDTO){
    BookDTO dto = bookService.createNewBook(bookCreateDTO);
    return ResponseEntity.ok().body(dto);
  }

  @DeleteMapping("/deleteBook/{id}")
  public ResponseEntity<Void> deleteBook(@PathVariable Long id){
    bookService.deleteBookById(id);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/updateBook/{id}")
  public ResponseEntity<BookDTO> updateBook(Long id,@RequestBody BookCreateDTO bookUpdateDTO){
    BookDTO dto = bookService.updateBook(id, bookUpdateDTO);
    return ResponseEntity.ok().body(dto);
  }

}
