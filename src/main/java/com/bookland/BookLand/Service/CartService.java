package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.CartDTOs.AddToCartDTO;
import com.bookland.BookLand.DTO.CartDTOs.CartDTO;
import com.bookland.BookLand.DTO.CartDTOs.DeleteFromCartDTO;

public interface CartService {

  CartDTO getUserCart(String name);

  CartDTO addItemToCart(String name, AddToCartDTO addDTO);

  CartDTO removeItemFromCart(String name, DeleteFromCartDTO deleteDTO);

  void deleteItemFromCart(String name, DeleteFromCartDTO deleteDTO);

  void deleteCart(Long id);
}
