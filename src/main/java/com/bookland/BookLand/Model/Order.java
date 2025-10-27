package com.bookland.BookLand.Model;

import com.bookland.BookLand.Model.EnumClasses.OrderStatus;
import com.bookland.BookLand.Model.EnumClasses.PaymentMethod;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private User user;

  @CreationTimestamp
  @Column(name = "order_date", updatable = false)
  private LocalDateTime orderDate;

  @DecimalMin(value = "0.0", message = "Сумма заказа не может быть отрицательной")
  @Column(name = "total_amount", nullable = false)
  private Double totalAmount;

  @Enumerated(EnumType.STRING)
  @Builder.Default
  private OrderStatus status = OrderStatus.PENDING;

  @NotBlank(message = "Адрес доставки не может быть пустым")
  @Column(name = "shipping_address", nullable = false, columnDefinition = "TEXT")
  private String shippingAddress;

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_method")
  private PaymentMethod paymentMethod = PaymentMethod.PURSE;

  @Column(name = "tracking_number")
  private String trackingNumber;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  private List<OrderItem> orderItems = new ArrayList<>();
}
