package com.bookland.BookLand.DTO.UserDTOs;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UpdateUserDTO {
  private final String firstName;
  private final String lastName;
  private final String email;
  private final String phone;
  private final String deliveryAddress;
}
