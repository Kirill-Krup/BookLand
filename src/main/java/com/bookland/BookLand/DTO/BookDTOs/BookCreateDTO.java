package com.bookland.BookLand.DTO.BookDTOs;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookCreateDTO {
  @NotBlank(message = "Название книги не может быть пустым")
  private String title;

  private String isbn;

  private String description;

  @DecimalMin(value = "0.0", message = "Цена не может быть отрицательной")
  @NotNull(message = "Цена обязательна")
  private Double price;

  private LocalDate publicationDate;

  private Integer pages;

  private String coverImageUrl;

  private String publisherName;

  @NotNull(message = "Автор обязателен")
  private Long authorId;

  @NotNull(message = "Жанр обязателен")
  private Long genreId;
}
