package com.bookland.BookLand.Repository;

import com.bookland.BookLand.Model.Book;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

  List<Book> findFirst3ByOrderByCreatedAtDesc();

}
