package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.UserDTOs.UpdateUserDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserActivityDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserAllProfileDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserLoginDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserRegistrationDTO;
import com.bookland.BookLand.Model.User;
import com.bookland.BookLand.Model.UserActivity;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

  UserLoginDTO toLoginDto(User user);
  User toEntity(UserLoginDTO dto);

  UserRegistrationDTO toRegistrationDto(User user);
  User toEntity(UserRegistrationDTO dto);
  
  UserProfileDTO toProfileDto(User user);
  User toEntity(UserProfileDTO dto);

  UserAllProfileDTO toDto(User user);
  User toEntity(UserAllProfileDTO dto);

  List<UserActivityDTO> toActivityDTOList(List<UserActivity> list);

  User toUpdateUserEntity(UpdateUserDTO dto);

  List<UserProfileDTO> toProfileDtoList(List<User> allUsers);
}