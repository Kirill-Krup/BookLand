package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.AuthorDTOs.AuthorCreateDTO;
import com.bookland.BookLand.DTO.AuthorDTOs.AuthorDTO;
import java.util.List;

public interface AuthorService {

  List<AuthorDTO> getAllAuthors();

  AuthorDTO createAuthor(AuthorCreateDTO authorCreateDTO);

  void deleteUserById(Long id);
}
