package com.bookland.BookLand.DTO.CartDTOs;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateCartItemDTO {
  @Min(value = 1, message = "Количество должно быть не менее 1")
  private Integer quantity;
}
