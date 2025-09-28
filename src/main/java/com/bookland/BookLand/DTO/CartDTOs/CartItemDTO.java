package com.bookland.BookLand.DTO.CartDTOs;

import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import lombok.Data;

@Data
public class CartItemDTO {
  private Long id;
  private BookSimpleDTO book;
  private Integer quantity;
  private Double subtotal;
}
