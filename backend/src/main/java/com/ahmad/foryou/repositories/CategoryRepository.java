package com.ahmad.foryou.repositories;

import com.ahmad.foryou.database.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // You don't need to write any methods here yet.
    // JpaRepository already gives you .save(), .findAll(), and .findById().
}
