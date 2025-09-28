package com.bookland.BookLand.DTO.ReplenishmentDTOs;

import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import com.bookland.BookLand.Model.EnumClasses.PaymentMethod;
import com.bookland.BookLand.Model.EnumClasses.ReplenishmentStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReplenishmentDTO {
  private Long id;
  private UserProfileDTO user;
  private Double amount;
  private LocalDateTime replenishmentDate;
  private PaymentMethod paymentMethod;
  private String transactionId;
  private ReplenishmentStatus status;
}
