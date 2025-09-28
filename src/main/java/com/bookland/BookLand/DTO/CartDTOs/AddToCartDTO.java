package com.bookland.BookLand.DTO.CartDTOs;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddToCartDTO {
  @NotNull(message = "ID книги обязателен")
  private Long bookId;

  @Min(value = 1, message = "Количество должно быть не менее 1")
  private Integer quantity = 1;
}
