package com.bookland.BookLand.DTO.WishlistDTOs;

import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class WishlistDTO {
  private Long id;
  private UserProfileDTO user;
  private List<WishlistItemDTO> items;
}