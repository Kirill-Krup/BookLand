package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.ReviewDTOs.ReviewCreateDTO;
import com.bookland.BookLand.DTO.ReviewDTOs.ReviewDTO;
import com.bookland.BookLand.Service.ReviewService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

  private final ReviewService reviewService;

  @GetMapping("/getAllReviews")
  public ResponseEntity<List<ReviewDTO>> getAllReviews() {
    List<ReviewDTO> reviewDTOList = reviewService.getAllReviews();
    return new ResponseEntity<>(reviewDTOList, HttpStatus.OK);
  }

  @GetMapping("/getMyReviews/{id}")
  public ResponseEntity<List<ReviewDTO>> getMyReviews(@PathVariable Long id) {
    List<ReviewDTO> list = reviewService.getMyReviewsById(id);
    return new ResponseEntity<>(list, HttpStatus.OK);
  }

  @PostMapping("/createReview")
  public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewCreateDTO reviewDTO) {
    ReviewDTO createdDto = reviewService.createReview(reviewDTO);
    return new ResponseEntity<>(createdDto, HttpStatus.CREATED);
  }

  @DeleteMapping("/deleteReview/{id}")
  public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
    reviewService.deleteReviewById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

}
