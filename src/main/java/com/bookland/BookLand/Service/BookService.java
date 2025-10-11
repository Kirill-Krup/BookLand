package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.BookDTOs.BookDTO;
import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import java.util.List;

public interface BookService {
  List<BookSimpleDTO> getNewBooks();
  List<BookDTO> getAllBooks();
}
