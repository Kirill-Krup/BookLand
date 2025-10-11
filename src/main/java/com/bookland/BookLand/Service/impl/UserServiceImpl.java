package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.UserDTOs.UserAllProfileDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import com.bookland.BookLand.Mapper.UserMapper;
import com.bookland.BookLand.Model.User;
import com.bookland.BookLand.Repository.UserRepository;
import com.bookland.BookLand.Service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
  private UserMapper userMapper;
  private UserRepository userRepository;

  public UserServiceImpl(UserMapper userMapper, UserRepository userRepository) {
    this.userMapper = userMapper;
    this.userRepository = userRepository;
  }

  public UserProfileDTO getProfileByLogin(String login) {
    User user = userRepository.findUserByLogin(login);
    return userMapper.toProfileDto(user);
  }

  @Override
  public UserAllProfileDTO getAllProfileByLogin(String login) {
    User user = userRepository.findUserByLogin(login);
    return userMapper.toDto(user);
  }

}