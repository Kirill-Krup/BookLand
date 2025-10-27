package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.UserDTOs.AuthResponse;
import com.bookland.BookLand.DTO.UserDTOs.UserLoginDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserRegistrationDTO;
import com.bookland.BookLand.Exception.UserNotFoundException;
import com.bookland.BookLand.Mapper.UserMapper;
import com.bookland.BookLand.Model.User;
import com.bookland.BookLand.Repository.UserRepository;
import com.bookland.BookLand.Service.AuthService;
import com.bookland.BookLand.Utils.JwtProvider;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final JwtProvider jwtProvider;
  private final PasswordEncoder passwordEncoder;

  public AuthResponse login(UserLoginDTO loginDTO) {
    User user = userRepository.findByLoginOrEmail(loginDTO.getStr(), loginDTO.getStr())
        .orElseThrow(() -> new UserNotFoundException(loginDTO.getStr()));

    if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
      throw new RuntimeException("Неверный пароль");
    }

    String token = jwtProvider.generateToken(user.getLogin());
    UserProfileDTO profile = userMapper.toProfileDto(user);

    return new AuthResponse(token, profile);
  }

  public AuthResponse register(UserRegistrationDTO registrationDTO) {
    if(userRepository.existsByLogin(registrationDTO.getLogin())){
      throw new RuntimeException("Логин занят");
    }

    if (userRepository.existsByEmail(registrationDTO.getEmail())) {
      throw new RuntimeException("Email уже используется");
    }

    User user = new User();
    user.setLogin(registrationDTO.getLogin());
    user.setEmail(registrationDTO.getEmail());
    user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
    user.setFirstName(registrationDTO.getFirstName());
    user.setLastName(registrationDTO.getLastName());
    user.setPhone(registrationDTO.getPhone());
    user.setDeliveryAddress(registrationDTO.getDeliveryAddress());
    user.setRegistrationDate(LocalDateTime.now());
    user.setWallet(0.0);
    userRepository.save(user);
    String token = jwtProvider.generateToken(user.getLogin());
    return new AuthResponse(token, userMapper.toProfileDto(user));
  }
}
