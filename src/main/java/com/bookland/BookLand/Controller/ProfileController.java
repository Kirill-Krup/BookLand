package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.UserDTOs.UpdateUserDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserAllProfileDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import com.bookland.BookLand.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    UserProfileDTO profileDTO = userService.getProfileByLogin(authentication.getName());
    return ResponseEntity.ok(profileDTO);
  }

  @GetMapping("/getAllProfileInfo")
  public ResponseEntity<UserAllProfileDTO> getAllProfile(Authentication authentication) {
    UserAllProfileDTO profileDTO = userService.getAllProfileByLogin(authentication.getName());
    return ResponseEntity.ok(profileDTO);
  }

  @PutMapping("/update")
  public ResponseEntity<UserAllProfileDTO> updateProfile(Authentication authentication, @RequestBody UpdateUserDTO userProfileDTO) {
      UserAllProfileDTO dto= userService.updateUser(authentication.getName(), userProfileDTO);
      return ResponseEntity.ok(dto);
  }

}
