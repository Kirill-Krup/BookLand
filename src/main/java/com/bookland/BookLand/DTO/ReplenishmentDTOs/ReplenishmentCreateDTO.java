package com.bookland.BookLand.DTO.ReplenishmentDTOs;

import com.bookland.BookLand.Model.EnumClasses.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReplenishmentCreateDTO {
  @NotNull(message = "Сумма обязательна")
  @DecimalMin(value = "0.01", message = "Сумма должна быть больше 0")
  private Double amount;

  @NotNull(message = "Способ оплаты обязателен")
  private PaymentMethod paymentMethod;
}
