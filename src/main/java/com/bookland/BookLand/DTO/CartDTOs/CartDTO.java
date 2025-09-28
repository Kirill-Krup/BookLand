package com.bookland.BookLand.DTO.CartDTOs;

import lombok.Data;
import java.util.List;

@Data
public class CartDTO {
  private Long id;
  private UserProfileDTO user;
  private List<CartItemDTO> cartItems;
  private Double totalPrice;
}
