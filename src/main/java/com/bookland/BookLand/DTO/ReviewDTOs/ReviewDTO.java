package com.bookland.BookLand.DTO.ReviewDTOs;

import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import com.bookland.BookLand.DTO.UserDTOs.UserProfileDTO;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDTO {
  private Long id;
  private UserProfileDTO user;
  private BookSimpleDTO book;
  private Integer rating;
  private String comment;
  private LocalDateTime reviewDate;
  private Boolean isApproved;
}