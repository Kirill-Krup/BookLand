package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.UserDTOs.UserAllProfileDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import com.bookland.BookLand.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profile")
public class ProfileController {
  private final UserService userService;

  public ProfileController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/getProfile")
  public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
    String login = authentication.getName();
    UserProfileDTO profileDTO = userService.getProfileByLogin(login);
    return ResponseEntity.ok(profileDTO);
  }

  @GetMapping("/getAllProfileInfo")
  public ResponseEntity<UserAllProfileDTO> getAllProfile(Authentication authentication) {
    String login = authentication.getName();
    UserAllProfileDTO profileDTO = userService.getAllProfileByLogin(login);
    return ResponseEntity.ok(profileDTO);
  }

}
