package com.bookland.BookLand.DTO.UserDTOs;

import com.bookland.BookLand.Model.EnumClasses.ActivityType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserActivityDTO {
  private ActivityType type;
  private String description;
  private String timeAgo;
  private LocalDateTime createdAt;
}
