package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.UserDTOs.AuthResponse;
import com.bookland.BookLand.DTO.UserDTOs.UserLoginDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserRegistrationDTO;
import com.bookland.BookLand.Service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
public class AuthController {
  private AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO loginDTO) {
    AuthResponse authResponse = authService.login(loginDTO);

    ResponseCookie cookie = ResponseCookie.from("jwt", authResponse.getToken())
        .httpOnly(true)
        .secure(false)
        .path("/")
        .maxAge(24 * 60 * 60)
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(authResponse.getUser());
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegistrationDTO dto, HttpServletResponse response) {
    AuthResponse authResponse = authService.register(dto);

    ResponseCookie cookie = ResponseCookie.from("jwt", authResponse.getToken())
        .httpOnly(true)
        .path("/")
        .maxAge(24 * 60 * 60)
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    return ResponseEntity.ok(authResponse);
  }
}
