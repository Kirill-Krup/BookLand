package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.WishlistDTOs.WishlistDTO;
import com.bookland.BookLand.Model.Wishlist;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class, BookMapper.class})
public interface WishlistMapper {
  WishlistDTO toDto(Wishlist wishlist);
  Wishlist toEntity(WishlistDTO dto);
}