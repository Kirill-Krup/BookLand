package com.bookland.BookLand.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Order order;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "book_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private Book book;

  @Min(value = 1, message = "Количество должно быть не менее 1")
  private Integer quantity;

  @DecimalMin(value = "0.0", message = "Цена не может быть отрицательной")
  @Column(name = "unit_price", nullable = false)
  private Double unitPrice;

  @Column(name = "subtotal", insertable = false, updatable = false)
  private Double subtotal;
}