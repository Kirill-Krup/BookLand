package com.bookland.BookLand.DTO.OrderDTOs;

import com.bookland.BookLand.Model.EnumClasses.OrderStatus;
import com.bookland.BookLand.Model.EnumClasses.PaymentMethod;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class OrderCreateDTO {

  private LocalDateTime orderDate = LocalDateTime.now();
  private Double totalAmount;
  private OrderStatus status = OrderStatus.PENDING;

  @NotBlank(message = "Адрес доставки не может быть пустым")
  private String shippingAddress;

  @Enumerated(EnumType.STRING)
  private PaymentMethod paymentMethod = PaymentMethod.PURSE;

  private String trackingNumber;

  List<OrderItemDTO> allItems;
}
