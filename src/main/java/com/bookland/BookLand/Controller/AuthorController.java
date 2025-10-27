package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.AuthorDTOs.AuthorCreateDTO;
import com.bookland.BookLand.DTO.AuthorDTOs.AuthorDTO;
import com.bookland.BookLand.Service.AuthorService;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/authors")
@RequiredArgsConstructor
public class AuthorController {

  private final AuthorService authorService;

  @PostMapping("/createAuthor")
  @PreAuthorize("hasRole = 'ADMIN'")
  public ResponseEntity<AuthorDTO> createAuthor(@RequestBody AuthorCreateDTO authorCreateDTO) {
    AuthorDTO dto = authorService.createAuthor(authorCreateDTO);
    return new ResponseEntity<>(dto, HttpStatus.CREATED);
  }

  @GetMapping("/getAllAuthors")
  public ResponseEntity<List<AuthorDTO>> getAllAuthors() {
    List<AuthorDTO> authorDTOs = authorService.getAllAuthors();
    return new ResponseEntity<>(authorDTOs, HttpStatus.OK);
  }


  @Transactional
  @DeleteMapping("/deleteAuthor/{id}")
  @PreAuthorize("hasRole = 'ADMIN'")
  public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
    authorService.deleteUserById(id);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
