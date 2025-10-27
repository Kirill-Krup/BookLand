package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.UserDTOs.CreateUserActivity;
import com.bookland.BookLand.DTO.UserDTOs.UpdateUserDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserAllProfileDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import java.util.List;

public interface UserService {
  UserProfileDTO getProfileByLogin(String login);
  UserAllProfileDTO getAllProfileByLogin(String login);

  UserAllProfileDTO updateUser(String login, UpdateUserDTO userProfileDTO);

  List<UserProfileDTO> getAllUsers();

  UserProfileDTO blockUserById(Long id);

  UserProfileDTO unBlockUserById(Long id);

  void deleteUserById(Long id);

  UserProfileDTO createNewActivity(CreateUserActivity createUserActivity);
}
