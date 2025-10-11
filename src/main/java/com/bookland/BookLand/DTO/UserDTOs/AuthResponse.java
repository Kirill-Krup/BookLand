package com.bookland.BookLand.DTO.UserDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
  private String token;
  private UserProfileDTO user;
}
