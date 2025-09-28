package com.bookland.BookLand.DTO.OrderDTOs;

import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import com.bookland.BookLand.Model.EnumClasses.OrderStatus;
import com.bookland.BookLand.Model.EnumClasses.PaymentMethod;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
  private Long id;
  private UserProfileDTO user;
  private LocalDateTime orderDate;
  private Double totalAmount;
  private OrderStatus status;
  private String shippingAddress;
  private PaymentMethod paymentMethod;
  private String trackingNumber;
  private List<OrderItemDTO> orderItems;
}
