package com.bookland.BookLand.DTO.UserDTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDTO {

  @Email(message = "Некорректный email")
  private String email;

  @Size(max = 50)
  private String firstName;

  @Size(max = 50)
  private String lastName;

  private String phone;

  private String photoPath;
  private String deliveryAddress;
}
