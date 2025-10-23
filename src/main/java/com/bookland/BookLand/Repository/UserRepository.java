package com.bookland.BookLand.Repository;

import com.bookland.BookLand.Model.User;
import java.util.Optional;
import javax.swing.text.html.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByLoginOrEmail(String login, String email);
  boolean existsByLogin(String login);
  boolean existsByEmail(String email);

  User findUserByLogin(String login);

  Optional<User> findByLogin(String username);

  User findUserById(Long id);
}
