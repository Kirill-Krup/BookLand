package com.bookland.BookLand.DTO.WishlistDTOs;

import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WishlistItemDTO {
  private Long id;
  private BookSimpleDTO book;
  private LocalDateTime addedDate;
}
