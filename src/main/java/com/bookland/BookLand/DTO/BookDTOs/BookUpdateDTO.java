package com.bookland.BookLand.DTO.BookDTOs;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookUpdateDTO {
  private String title;
  private String isbn;
  private String description;

  @DecimalMin(value = "0.0", message = "Цена не может быть отрицательной")
  private Double price;

  @Min(value = 0, message = "Количество не может быть отрицательным")
  private Integer quantityInStock;

  private LocalDate publicationDate;
  private Integer pages;
  private String coverImageUrl;
  private String publisherName;
  private Long authorId;
  private Long genreId;
}
