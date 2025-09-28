package com.bookland.BookLand.DTO.GenreDTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GenreCreateDTO {
  @NotBlank(message = "Название жанра не может быть пустым")
  private String name;
  private String description;
}
