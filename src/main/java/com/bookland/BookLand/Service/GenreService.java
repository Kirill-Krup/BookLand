package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.GenreDTOs.GenreCreateDTO;
import com.bookland.BookLand.DTO.GenreDTOs.GenreDTO;
import java.util.List;

public interface GenreService {

  GenreDTO createGenre(GenreCreateDTO genre);

  List<GenreDTO> getAllGenres();

  void deleteGenreById(Long id);
}
