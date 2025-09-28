package com.bookland.BookLand.DTO.OrderDTOs;

import com.bookland.BookLand.Model.EnumClasses.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateDTO {
  @NotNull(message = "Статус обязателен")
  private OrderStatus status;

  private String trackingNumber;
}
