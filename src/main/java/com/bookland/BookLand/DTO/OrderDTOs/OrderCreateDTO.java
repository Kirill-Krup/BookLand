package com.bookland.BookLand.DTO.OrderDTOs;

import com.bookland.BookLand.Model.EnumClasses.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderCreateDTO {
  @NotBlank(message = "Адрес доставки обязателен")
  private String shippingAddress;

  @NotNull(message = "Способ оплаты обязателен")
  private PaymentMethod paymentMethod;
}
