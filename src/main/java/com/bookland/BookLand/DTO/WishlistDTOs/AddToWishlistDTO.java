package com.bookland.BookLand.DTO.WishlistDTOs;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddToWishlistDTO {
  @NotNull(message = "ID книги обязателен")
  private Long bookId;
}
