package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.ReviewDTOs.ReviewCreateDTO;
import com.bookland.BookLand.DTO.ReviewDTOs.ReviewDTO;
import java.util.List;

public interface ReviewService {

  List<ReviewDTO> getAllReviews();

  ReviewDTO createReview(ReviewCreateDTO reviewDTO);

  void deleteReviewById(Long id);

  List<ReviewDTO> getMyReviewsById(Long id);
}
