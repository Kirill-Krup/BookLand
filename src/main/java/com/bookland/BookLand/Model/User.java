package com.bookland.BookLand.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String login;
  private String password;
  private String email;

  @Column(name = "first_name")
  private String firstName;

  @Column(name = "last_name")
  private String lastName;

  @Column(name = "photo_path")
  private String photoPath;

  @Column(name = "registration_date")
  private LocalDateTime registrationDate;

  private Double wallet;

  @Column(name = "delivery_address")
  private String deliveryAddress;

  @Column(name = "phone")
  private String phone;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private List<UserActivity> activities;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Cart cart;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private List<Order> orders;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private List<Replenishment> replenishments;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private List<Review> reviews;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private List<Wishlist> wishlistItems;
}
