package com.bookland.BookLand.Repository;

import com.bookland.BookLand.Model.Cart;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

  @Query("SELECT c FROM Cart c WHERE c.user.login = :login")
  Optional<Cart> findByLogin(String login); // Меняем на Optional

  @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems WHERE c.user.login = :login")
  Optional<Cart> findByLoginWithItems(String login);

  boolean existsByUserLogin(String login);
}
