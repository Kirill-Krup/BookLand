package com.bookland.BookLand.Repository;

import com.bookland.BookLand.Model.Author;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

  Author findAuthorById(Long authorId);
}
