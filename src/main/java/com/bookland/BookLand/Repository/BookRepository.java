package com.bookland.BookLand.Repository;

import com.bookland.BookLand.Model.Book;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

  List<Book> findFirst3ByOrderByCreatedAtDesc();

  Optional<Book> findById(Long bookId);

  void deleteBookById(Long id);

  Book findBookById(Long id);

  @Query(value = "SELECT * FROM books ORDER BY RANDOM() LIMIT 4", nativeQuery = true)
  List<Book> findRandomBooks();
}
