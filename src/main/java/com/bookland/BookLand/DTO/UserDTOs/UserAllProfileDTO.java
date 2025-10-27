package com.bookland.BookLand.DTO.UserDTOs;

import com.bookland.BookLand.DTO.ReplenishmentDTOs.ReplenishmentDTO;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserAllProfileDTO {
  private Long id;
  private String login;
  private String password;
  private String email;
  private String firstName;
  private String lastName;
  private String photoPath;
  private LocalDateTime registrationDate;
  private Double wallet;
  private String deliveryAddress;
  private String phone;
  private List<UserActivityDTO> activities;
}
