package com.bookland.BookLand.DTO.BookDTOs;

import com.bookland.BookLand.DTO.AuthorDTOs.AuthorDTO;
import com.bookland.BookLand.DTO.GenreDTOs.GenreDTO;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookDTO {
  private Long id;
  private String title;
  private String isbn;
  private String description;
  private Double price;
  private Integer quantityInStock;
  private LocalDate publicationDate;
  private Integer pages;
  private String coverImageUrl;
  private String publisherName;
  private AuthorDTO author;
  private GenreDTO genre;
}
