package com.bookland.BookLand.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items",
    uniqueConstraints = @UniqueConstraint(columnNames = {"cart_id", "book_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cart_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Cart cart;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "book_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Book book;

  @Min(value = 1, message = "Количество должно быть не менее 1")
  @Builder.Default
  private Integer quantity = 1;

  @CreationTimestamp
  @Column(name = "added_at", updatable = false)
  private LocalDateTime addedAt;
}