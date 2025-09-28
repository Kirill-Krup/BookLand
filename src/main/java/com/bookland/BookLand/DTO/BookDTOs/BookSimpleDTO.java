package com.bookland.BookLand.DTO.BookDTOs;

import lombok.Data;

@Data
public class BookSimpleDTO {
  private Long id;
  private String title;
  private String coverImageUrl;
  private Double price;
  private String authorName;
}
