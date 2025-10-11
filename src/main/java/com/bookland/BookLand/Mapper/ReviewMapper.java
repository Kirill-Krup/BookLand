package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.ReviewDTOs.ReviewDTO;
import com.bookland.BookLand.Model.Review;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class, BookMapper.class})
public interface ReviewMapper {

  ReviewDTO toDto(Review review);

  Review toEntity(ReviewDTO dto);
}
