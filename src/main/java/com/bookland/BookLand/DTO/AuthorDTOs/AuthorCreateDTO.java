package com.bookland.BookLand.DTO.AuthorDTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthorCreateDTO {
  @NotBlank(message = "Имя автора не может быть пустым")
  private String name;
  private String biography;
}
