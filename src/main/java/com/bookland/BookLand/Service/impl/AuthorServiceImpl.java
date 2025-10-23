package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.AuthorDTOs.AuthorCreateDTO;
import com.bookland.BookLand.DTO.AuthorDTOs.AuthorDTO;
import com.bookland.BookLand.Mapper.AuthorMapper;
import com.bookland.BookLand.Model.Author;
import com.bookland.BookLand.Repository.AuthorRepository;
import com.bookland.BookLand.Service.AuthorService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

  private final AuthorRepository authorRepository;
  private final AuthorMapper authorMapper;

  @Override
  public List<AuthorDTO> getAllAuthors() {
    List<Author> allAuthors = authorRepository.findAll();
    return allAuthors.stream().map(authorMapper::toDto).collect(Collectors.toList());
  }

  @Override
  public AuthorDTO createAuthor(AuthorCreateDTO authorCreateDTO) {
    Author author = authorMapper.toEntity(authorCreateDTO);
    return authorMapper.toDto(authorRepository.save(author));
  }

  @Override
  public void deleteUserById(Long id) {
    authorRepository.deleteById(id);
  }
}
