package com.bookland.BookLand.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Название книги не может быть пустым")
  @Column(nullable = false)
  private String title;

  @Column(unique = true)
  private String isbn;

  @Column(columnDefinition = "TEXT")
  private String description;

  @DecimalMin(value = "0.0", message = "Цена не может быть отрицательной")
  @Column(nullable = false)
  private Double price;

  @Min(value = 0, message = "Количество не может быть отрицательным")
  @Column(name = "quantity_in_stock")
  @Builder.Default
  private Integer quantityInStock = 0;

  @Column(name = "publication_date")
  private LocalDate publicationDate;

  private Integer pages;

  @Column(name = "cover_image_url")
  private String coverImageUrl;

  @Column(name = "publisher_name")
  private String publisherName;

  // Relationships
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Author author;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "genre_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Genre genre;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  private List<OrderItem> orderItems = new ArrayList<>();

  @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  private List<CartItem> cartItems = new ArrayList<>();

  @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  private List<Review> reviews = new ArrayList<>();

  @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  private List<Wishlist> wishlistItems = new ArrayList<>();
}
