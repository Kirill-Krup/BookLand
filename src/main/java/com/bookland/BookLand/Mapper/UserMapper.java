package com.bookland.BookLand.Mapper;

import com.example.demo.DTO.UserDTO;
import com.example.demo.Model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface UserMapper {

  UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

  UserDTO toDTO(User user);

  User toEntity(UserDTO userDTO);
}
