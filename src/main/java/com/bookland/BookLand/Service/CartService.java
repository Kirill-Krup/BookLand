package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.CartDTOs.AddToCartDTO;
import com.bookland.BookLand.DTO.CartDTOs.CartDTO;

public interface CartService {

  CartDTO getUserCart(String name);

  CartDTO addItemToCart(String name, AddToCartDTO addDTO);
}
