package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.ReviewDTOs.ReviewDTO;
import java.util.List;

public interface ReviewService {

  List<ReviewDTO> getAllReviews();

  ReviewDTO createReview(ReviewDTO reviewDTO);

  void deleteReviewById(Long id);
}
