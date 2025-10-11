package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.GenreDTOs.GenreCreateDTO;
import com.bookland.BookLand.DTO.GenreDTOs.GenreDTO;
import com.bookland.BookLand.Model.Genre;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GenreMapper {
  GenreDTO toDto(Genre genre);
  Genre toEntity(GenreDTO dto);

  Genre toEntity(GenreCreateDTO dto);
}