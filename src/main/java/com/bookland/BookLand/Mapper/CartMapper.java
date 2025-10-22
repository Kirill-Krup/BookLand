package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.CartDTOs.CartDTO;
import com.bookland.BookLand.DTO.CartDTOs.CartItemDTO;
import com.bookland.BookLand.Model.Cart;
import com.bookland.BookLand.Model.CartItem;
import java.util.Optional;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class, BookMapper.class})
public interface CartMapper {
  CartDTO toDto(Cart cart);
  Cart toEntity(CartDTO dto);

  CartItemDTO toDto(CartItem item);
  CartItem toEntity(CartItemDTO dto);

  CartDTO toDto(Optional<Cart> cart);
}
