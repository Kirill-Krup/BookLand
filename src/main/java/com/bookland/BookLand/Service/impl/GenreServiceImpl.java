package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.GenreDTOs.GenreCreateDTO;
import com.bookland.BookLand.DTO.GenreDTOs.GenreDTO;
import com.bookland.BookLand.Mapper.GenreMapper;
import com.bookland.BookLand.Model.Genre;
import com.bookland.BookLand.Repository.GenreRepository;
import com.bookland.BookLand.Service.GenreService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

  private final GenreRepository genreRepository;
  private final GenreMapper genreMapper;

  @Override
  public GenreDTO createGenre(GenreCreateDTO genre) {
    Genre genreForCreate = genreMapper.toEntity(genre);
    return genreMapper.toDto(genreRepository.save(genreForCreate));
  }

  @Override
  public List<GenreDTO> getAllGenres() {
    List<Genre> allGenres = genreRepository.findAll();
    return allGenres.stream().map(genreMapper::toDto).collect(Collectors.toList());
  }

  @Override
  public void deleteGenreById(Long id) {
    genreRepository.deleteById(id);
  }
}
