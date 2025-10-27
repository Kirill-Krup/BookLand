package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.UserDTOs.CreateUserActivity;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import com.bookland.BookLand.Service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/allUsers")
  @PreAuthorize("hasRole = 'ADMIN'")
  public ResponseEntity<List<UserProfileDTO>> getAllUsers() {
    List<UserProfileDTO> allUsers = userService.getAllUsers();
    return new ResponseEntity<>(allUsers, HttpStatus.OK);
  }

  @PutMapping("/blockUser/{id}")
  @PreAuthorize("hasRole = 'ADMIN'")
  public ResponseEntity<UserProfileDTO> blockUser(@PathVariable Long id) {
    UserProfileDTO dto = userService.blockUserById(id);
    return new ResponseEntity<>(dto, HttpStatus.OK);
  }

  @PutMapping("/unBlockUser/{id}")
  @PreAuthorize("hasRole = 'ADMIN'")
  public ResponseEntity<UserProfileDTO> unBlockUser(@PathVariable Long id) {
    UserProfileDTO dto = userService.unBlockUserById(id);
    return new ResponseEntity<>(dto, HttpStatus.OK);
  }

  @DeleteMapping("/deleteUser/{id}")
  @PreAuthorize("hasRole = 'ADMIN'")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteUserById(id);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PostMapping("/createNewActivity")
  public ResponseEntity<UserProfileDTO> createNewActivity(@RequestBody CreateUserActivity createUserActivity) {
    UserProfileDTO dto = userService.createNewActivity(createUserActivity);
    return new ResponseEntity<>(dto, HttpStatus.OK);
  }


}
