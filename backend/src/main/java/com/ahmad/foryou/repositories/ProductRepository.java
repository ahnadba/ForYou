package com.ahmad.foryou.repositories;

import com.ahmad.foryou.database.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = {"category"})
    List<Product> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByActiveTrueOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByActiveTrueAndCategory_IdOrderByCreatedAtDesc(Long categoryId);

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByActiveTrueAndNameContainingIgnoreCaseOrderByCreatedAtDesc(String q);

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByActiveTrueAndCategory_IdAndNameContainingIgnoreCaseOrderByCreatedAtDesc(Long categoryId, String q);

    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findByIdAndActiveTrue(Long id);

    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findOneById(Long id);

    @EntityGraph(attributePaths = {"category"})
    List<Product> findTop4ByActiveTrueOrderByCreatedAtDesc();
}