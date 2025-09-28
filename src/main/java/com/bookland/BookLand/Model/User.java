package com.bookland.BookLand.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Логин не может быть пустым")
  @Size(min = 3, max = 50)
  @Column(unique = true, nullable = false)
  private String login;

  @NotBlank(message = "Пароль не может быть пустым")
  @Column(nullable = false)
  private String password;

  @Email(message = "Некорректный email")
  @NotBlank(message = "Email не может быть пустым")
  @Column(unique = true, nullable = false)
  private String email;

  @NotBlank(message = "Имя не может быть пустым")
  @Size(max = 50)
  @Column(name = "first_name", nullable = false)
  private String firstName;

  @NotBlank(message = "Фамилия не может быть пустым")
  @Size(max = 50)
  @Column(name = "last_name", nullable = false)
  private String lastName;

  @Column(name = "photo_path")
  private String photoPath;

  @CreationTimestamp
  @Column(name = "registration_date", updatable = false)
  private LocalDateTime registrationDate;

  @DecimalMin(value = "0.0", message = "Баланс не может быть отрицательным")
  @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
  @Builder.Default
  private Double wallet = 0.0;

  @Column(name = "delivery_address")
  private String deliveryAddress;

  // Relationships
  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Cart cart;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  private List<Order> orders = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  private List<Replenishment> replenishments = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  private List<Review> reviews = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  private List<Wishlist> wishlistItems = new ArrayList<>();
}
