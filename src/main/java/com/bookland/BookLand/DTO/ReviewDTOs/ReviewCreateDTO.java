package com.bookland.BookLand.DTO.ReviewDTOs;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewCreateDTO {
  @NotNull(message = "ID книги обязателен")
  private Long bookId;

  @Min(value = 1, message = "Рейтинг должен быть от 1 до 5")
  @Max(value = 5, message = "Рейтинг должен быть от 1 до 5")
  @NotNull(message = "Рейтинг обязателен")
  private Integer rating;

  @Size(max = 1000, message = "Комментарий не должен превышать 1000 символов")
  private String comment;
}
