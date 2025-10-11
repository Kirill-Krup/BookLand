package com.bookland.BookLand.DTO.UserDTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegistrationDTO {

  @NotBlank(message = "Логин обязателен")
  private String login;

  @Email(message = "Некорректный email")
  @NotBlank(message = "Email обязателен")
  private String email;

  @NotBlank(message = "Пароль обязателен")
  private String password;
  private String phone;
  private String firstName;
  private String lastName;
  private String deliveryAddress;
}
