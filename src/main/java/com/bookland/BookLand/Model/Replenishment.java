package com.bookland.BookLand.Model;

import com.bookland.BookLand.Model.EnumClasses.PaymentMethod;
import com.bookland.BookLand.Model.EnumClasses.ReplenishmentStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "replenishment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Replenishment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private User user;

  @DecimalMin(value = "0.01", message = "Сумма пополнения должна быть больше 0")
  @Column(nullable = false)
  private Double amount;

  @CreationTimestamp
  @Column(name = "replenishment_date", updatable = false)
  private LocalDateTime replenishmentDate = LocalDateTime.now();

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_method")
  private PaymentMethod paymentMethod;

  @Enumerated(EnumType.STRING)
  @Builder.Default
  private ReplenishmentStatus status = ReplenishmentStatus.COMPLETED;
}
