package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.AuthorDTOs.AuthorCreateDTO;
import com.bookland.BookLand.DTO.AuthorDTOs.AuthorDTO;
import com.bookland.BookLand.Model.Author;
import org.mapstruct.*;


@Mapper(componentModel = "spring")
public interface AuthorMapper {
  AuthorDTO toDto(Author author);
  Author toEntity(AuthorDTO dto);

  Author toEntity(AuthorCreateDTO dto);
}