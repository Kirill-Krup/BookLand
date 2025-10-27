package com.bookland.BookLand.Repository;

import com.bookland.BookLand.Model.Book;
import com.bookland.BookLand.Model.Order;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

  List<Order> getOrdersByUserId(Long userId);

  @Query("SELECT b FROM Book b ORDER BY b.id DESC LIMIT :count")
  List<Book> findTopNBooksOrderByIdDesc(@Param("count") int count);
}
