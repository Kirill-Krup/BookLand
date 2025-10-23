package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.GenreDTOs.GenreCreateDTO;
import com.bookland.BookLand.DTO.GenreDTOs.GenreDTO;
import com.bookland.BookLand.Model.Genre;
import com.bookland.BookLand.Service.GenreService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/genres")
@RequiredArgsConstructor
public class GenreController {

  private final GenreService genreService;

  @PostMapping("/createGenre")
  public ResponseEntity<GenreDTO> createGenre(@RequestBody GenreCreateDTO genre) {
    GenreDTO dto = genreService.createGenre(genre);
    return new ResponseEntity<>(dto, HttpStatus.CREATED);
  }

  @GetMapping("/getAllGenres")
  public ResponseEntity<List<GenreDTO>> getAllGenres() {
    List<GenreDTO> allGenres = genreService.getAllGenres();
    return new ResponseEntity<>(allGenres, HttpStatus.OK);
  }

  @DeleteMapping("/deleteGenre/{id}")
  public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
    genreService.deleteGenreById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

}
