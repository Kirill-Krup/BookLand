package com.bookland.BookLand.DTO.UserDTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginDTO {
  @NotBlank(message = "Логин или почта не может быть пустыми")
  private String str;

  @NotBlank(message = "Пароль не может быть пустым")
  private String password;
}
