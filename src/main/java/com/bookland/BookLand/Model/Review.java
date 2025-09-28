package com.bookland.BookLand.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "book_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "book_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Book book;

  @Min(value = 1, message = "Рейтинг должен быть от 1 до 5")
  @Max(value = 5, message = "Рейтинг должен быть от 1 до 5")
  @Column(nullable = false)
  private Integer rating;

  @Column(columnDefinition = "TEXT")
  private String comment;

  @CreationTimestamp
  @Column(name = "review_date", updatable = false)
  private LocalDateTime reviewDate;

  @Column(name = "is_approved")
  @Builder.Default
  private Boolean isApproved = false;
}
