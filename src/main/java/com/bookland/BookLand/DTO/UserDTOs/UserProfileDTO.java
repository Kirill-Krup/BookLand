package com.bookland.BookLand.DTO.UserDTOs;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserProfileDTO {
  private Long id;
  private String login;
  private String email;
  private String firstName;
  private String lastName;
  private String photoPath;
  private LocalDateTime registrationDate;
  private Double wallet;
  private String deliveryAddress;
  private String phone;
  private boolean isBlocked;
  private String role;
}