package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.ReviewDTOs.ReviewDTO;
import com.bookland.BookLand.Mapper.ReviewMapper;
import com.bookland.BookLand.Model.Review;
import com.bookland.BookLand.Repository.ReviewRepository;
import com.bookland.BookLand.Service.ReviewService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

  private final ReviewRepository reviewRepository;
  private final ReviewMapper reviewMapper;

  @Override
  public List<ReviewDTO> getAllReviews() {
    List<Review> allReviews = reviewRepository.findAll();
    return allReviews.stream().map(reviewMapper::toDto).collect(Collectors.toList());
  }

  @Override
  public ReviewDTO createReview(ReviewDTO reviewDTO) {
    return null;
  }

  @Override
  @Transactional
  public void deleteReviewById(Long id) {
    reviewRepository.deleteById(id);
  }
}
