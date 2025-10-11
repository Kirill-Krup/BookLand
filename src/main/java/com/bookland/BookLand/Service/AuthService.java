package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.UserDTOs.AuthResponse;
import com.bookland.BookLand.DTO.UserDTOs.UserLoginDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserRegistrationDTO;

public interface AuthService {
  AuthResponse login(UserLoginDTO loginDTO);
  AuthResponse register(UserRegistrationDTO registrationDTO);

}
