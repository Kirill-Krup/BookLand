package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.UserDTOs.UserAllProfileDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;

public interface UserService {
  UserProfileDTO getProfileByLogin(String login);
  UserAllProfileDTO getAllProfileByLogin(String login);

  UserAllProfileDTO updateUser(String login, UserProfileDTO userProfileDTO);
}
