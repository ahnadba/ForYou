package com.ahmad.foryou.services;

import com.ahmad.foryou.database.Category;
import com.ahmad.foryou.database.Product;
import com.ahmad.foryou.dto.*;
import com.ahmad.foryou.repositories.CategoryRepository;
import com.ahmad.foryou.repositories.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductListItemDTO> getProducts(Long categoryId, String q, String lang) {
        String query = (q == null || q.trim().isEmpty()) ? null : q.trim();

        List<Product> products;

        if (categoryId == null && query == null) {
            products = productRepository.findByActiveTrueOrderByCreatedAtDesc();
        } else if (categoryId != null && query == null) {
            products = productRepository.findByActiveTrueAndCategory_IdOrderByCreatedAtDesc(categoryId);
        } else if (categoryId == null) {
            products = productRepository.findByActiveTrueAndNameContainingIgnoreCaseOrderByCreatedAtDesc(query);
        } else {
            products = productRepository.findByActiveTrueAndCategory_IdAndNameContainingIgnoreCaseOrderByCreatedAtDesc(categoryId, query);
        }

        return products.stream()
                .map(p -> {
                    String name = lang.equals("he") && p.getNameHe() != null && !p.getNameHe().isEmpty() ? p.getNameHe() : p.getName();
                    String categoryName = lang.equals("he") && p.getCategory().getNameHe() != null && !p.getCategory().getNameHe().isEmpty() ? p.getCategory().getNameHe() : p.getCategory().getName();
                    return new ProductListItemDTO(
                            p.getId(),
                            name,
                            p.getBasePrice(),
                            p.getMainImageUrl(),
                            p.getCategory().getId(),
                            categoryName,
                            p.getNameHe(),
                            p.getDescriptionHe(),
                            p.getCategory().getNameHe()
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDetailsDTO getProductDetails(Long id, String lang) {
        Product p = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + id));

        List<ProductImageDTO> images = p.getImages().stream()
                .sorted(Comparator.comparing(img -> !img.isMainImage()))
                .map(img -> new ProductImageDTO(img.getId(), img.getImageUrl(), img.isMainImage()))
                .toList();

        List<ProductVariantDTO> variants = p.getVariants().stream()
                .map(v -> new ProductVariantDTO(v.getId(), v.getName(), v.getPriceDelta(), v.isInStock()))
                .toList();

        String name = lang.equals("he") && p.getNameHe() != null && !p.getNameHe().isEmpty() ? p.getNameHe() : p.getName();
        String description = lang.equals("he") && p.getDescriptionHe() != null && !p.getDescriptionHe().isEmpty() ? p.getDescriptionHe() : p.getDescription();
        String categoryName = lang.equals("he") && p.getCategory().getNameHe() != null && !p.getCategory().getNameHe().isEmpty() ? p.getCategory().getNameHe() : p.getCategory().getName();

        return new ProductDetailsDTO(
                p.getId(),
                name,
                description,
                p.getMaterial(),
                p.getBasePrice(),
                p.getMainImageUrl(),
                p.getCategory().getId(),
                categoryName,
                images,
                variants,
                p.getNameHe(),
                p.getDescriptionHe(),
                p.getCategory().getNameHe()
        );
    }


    /* ---------------------------------------
       NEW COLLECTION (latest products)
       --------------------------------------- */

    public List<ProductListItemDTO> getNewestProducts(String lang) {

        List<Product> products = productRepository
                .findTop4ByActiveTrueOrderByCreatedAtDesc();

        return products.stream()
                .map(p -> {
                    String name = lang.equals("he") && p.getNameHe() != null && !p.getNameHe().isEmpty() ? p.getNameHe() : p.getName();
                    String categoryName = lang.equals("he") && p.getCategory().getNameHe() != null && !p.getCategory().getNameHe().isEmpty() ? p.getCategory().getNameHe() : p.getCategory().getName();
                    return new ProductListItemDTO(
                            p.getId(),
                            name,
                            p.getBasePrice(),
                            p.getMainImageUrl(),
                            p.getCategory().getId(),
                            categoryName,
                            p.getNameHe(),
                            p.getDescriptionHe(),
                            p.getCategory().getNameHe()
                    );
                })
                .toList();
    }

    /* ---------------------------------------
       CREATE PRODUCT
       --------------------------------------- */

    public ProductDetailsDTO createProduct(CreateProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setMaterial(request.getMaterial());
        product.setBasePrice(request.getPrice());
        product.setMainImageUrl(request.getMainImageUrl());
        product.setCategory(category);
        product.setActive(request.isActive());

        Product saved = productRepository.save(product);

        return getProductDetails(saved.getId(), "en");
    }
}