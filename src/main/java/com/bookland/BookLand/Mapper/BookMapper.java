package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.BookDTOs.BookCreateDTO;
import com.bookland.BookLand.DTO.BookDTOs.BookDTO;
import com.bookland.BookLand.DTO.BookDTOs.BookSimpleDTO;
import com.bookland.BookLand.DTO.BookDTOs.BookUpdateDTO;
import com.bookland.BookLand.Model.Book;
import java.util.List;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BookMapper {

  BookDTO toDto(Book book);

  Book toEntity(BookDTO dto);

  BookSimpleDTO toSimpleDto(Book book);

  Book toEntity(BookCreateDTO dto);

  void updateEntityFromDto(BookUpdateDTO dto, @MappingTarget Book book);
}
