package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.ReviewDTOs.ReviewCreateDTO;
import com.bookland.BookLand.DTO.ReviewDTOs.ReviewDTO;
import com.bookland.BookLand.Mapper.ReviewMapper;
import com.bookland.BookLand.Model.Review;
import com.bookland.BookLand.Repository.BookRepository;
import com.bookland.BookLand.Repository.ReviewRepository;
import com.bookland.BookLand.Repository.UserRepository;
import com.bookland.BookLand.Service.ReviewService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

  private final ReviewRepository reviewRepository;
  private final ReviewMapper reviewMapper;
  private final UserRepository userRepository;
  private final BookRepository bookRepository;

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public List<ReviewDTO> getAllReviews() {
    List<Review> allReviews = reviewRepository.findAll();
    return allReviews.stream().map(reviewMapper::toDto).collect(Collectors.toList());
  }

  @Override
  public ReviewDTO createReview(ReviewCreateDTO reviewDTO) {
    Review review = new Review();
    review.setBook(bookRepository.findBookById(reviewDTO.getBookId()));
    review.setUser(userRepository.findUserById(reviewDTO.getUserId()));
    review.setReviewDate(reviewDTO.getReviewDate());
    review.setComment(reviewDTO.getComment());
    review.setIsApproved(true);
    review.setRating(reviewDTO.getRating());
    reviewRepository.save(review);
    return reviewMapper.toDto(review);
  }

  @Override
  @Transactional
  public void deleteReviewById(Long id) {
    reviewRepository.deleteById(id);
  }

  @Override
  public List<ReviewDTO> getMyReviewsById(Long id) {
    List<Review> allReviews = reviewRepository.findReviewsByUserId(id);
    return allReviews.stream().map(reviewMapper::toDto).collect(Collectors.toList());
  }
}
