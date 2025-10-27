package com.bookland.BookLand.Repository;

import com.bookland.BookLand.Model.Replenishment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplenishmentRepository extends JpaRepository<Replenishment, Long> {

}
