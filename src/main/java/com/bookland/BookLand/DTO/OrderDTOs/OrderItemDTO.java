package com.bookland.BookLand.DTO.OrderDTOs;

import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import lombok.Data;

@Data
public class OrderItemDTO {
  private Long id;
  private BookSimpleDTO book;
  private Integer quantity;
  private Double unitPrice;
  private Double subtotal;
}