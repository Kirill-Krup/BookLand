package com.bookland.BookLand.DTO.UserDTOs;

import com.bookland.BookLand.Model.EnumClasses.ActivityType;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class CreateUserActivity {
  private Long userId;
  private ActivityType activityType;
  private String activityDescription;
}
