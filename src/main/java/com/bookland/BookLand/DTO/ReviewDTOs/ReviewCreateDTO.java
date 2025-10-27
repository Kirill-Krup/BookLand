package com.bookland.BookLand.DTO.ReviewDTOs;

import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ReviewCreateDTO {
  private Long userId;
  private Long bookId;
  private Integer rating;
  private String comment;
  private LocalDateTime reviewDate;
  private Boolean isApproved;
}
