package com.bookland.BookLand.Repository;

import com.bookland.BookLand.Model.Genre;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

  Genre findGenreById(Long genreId);
}
