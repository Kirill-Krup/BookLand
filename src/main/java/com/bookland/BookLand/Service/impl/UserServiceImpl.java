package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.UserDTOs.UserAllProfileDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import com.bookland.BookLand.Mapper.UserMapper;
import com.bookland.BookLand.Model.User;
import com.bookland.BookLand.Repository.UserRepository;
import com.bookland.BookLand.Service.UserService;
import java.util.ArrayList;
import java.util.List;
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

  @Override
  public UserAllProfileDTO updateUser(String login, UserProfileDTO userProfileDTO) {
    User user = userRepository.findUserByLogin(login);
    user.setFirstName(userProfileDTO.getFirstName());
    user.setLastName(userProfileDTO.getLastName());
    user.setEmail(userProfileDTO.getEmail());
    user.setPhone(userProfileDTO.getPhone());
    user.setDeliveryAddress(userProfileDTO.getDeliveryAddress());
    userRepository.save(user);
    return userMapper.toDto(user);
  }

  @Override
  public List<UserProfileDTO> getAllUsers() {
    List<User> allUsers = userRepository.findAll();
    return userMapper.toProfileDtoList(allUsers);
  }

  @Override
  public UserProfileDTO blockUserById(Long id) {
    User user = userRepository.findUserById(id);
    user.setBlocked(true);
    return userMapper.toProfileDto(userRepository.save(user));
  }

  @Override
  public UserProfileDTO unBlockUserById(Long id) {
    User user = userRepository.findUserById(id);
    user.setBlocked(false);
    return userMapper.toProfileDto(userRepository.save(user));
  }

  @Override
  public void deleteUserById(Long id) {
    userRepository.deleteById(id);
  }


}