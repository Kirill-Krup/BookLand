package com.bookland.BookLand.DTO.CartDTOs;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class DeleteFromCartDTO {
  @NotNull(message = "ID книги обязателен")
  private Long bookId;

  private final Integer quantity = 1;
}
