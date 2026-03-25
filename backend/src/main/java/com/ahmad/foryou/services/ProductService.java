package com.ahmad.foryou.services;

import com.ahmad.foryou.database.Category;
import com.ahmad.foryou.database.Product;
import com.ahmad.foryou.database.ProductImage;
import com.ahmad.foryou.database.ProductVariant;
import com.ahmad.foryou.dto.*;
import com.ahmad.foryou.repositories.CategoryRepository;
import com.ahmad.foryou.repositories.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

    @Transactional
    public ProductDetailsDTO createProduct(CreateProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        Product product = new Product();

        applyProductRequest(product, request, category);

        Product saved = productRepository.save(product);

        return getProductDetails(saved.getId(), "en");
    }

    @Transactional
    public Map<String, Object> createProductForAdmin(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        Product product = new Product();
        applyProductRequest(product, request, category);

        Product saved = productRepository.save(product);
        return toAdminProduct(saved);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getProductsForAdmin() {
        return productRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toAdminProduct)
                .toList();
    }

    @Transactional
    public Map<String, Object> updateProduct(Long id, CreateProductRequest request) {
        Product product = productRepository.findOneById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        applyProductRequest(product, request, category);

        Product saved = productRepository.save(product);
        return toAdminProduct(saved);
    }

    @Transactional
    public Map<String, Object> setProductActive(Long id, boolean active) {
        Product product = productRepository.findOneById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        product.setActive(active);
        Product saved = productRepository.save(product);
        return toAdminProduct(saved);
    }

    private void applyProductRequest(Product product, CreateProductRequest request, Category category) {
        String resolvedMainImageUrl = resolveMainImageUrl(request);

        product.setName(request.getName());
        product.setNameHe(request.getNameHe());
        product.setDescription(request.getDescription());
        product.setDescriptionHe(request.getDescriptionHe());
        product.setMaterial(request.getMaterial());
        product.setBasePrice(request.getPrice() == null ? BigDecimal.ZERO : request.getPrice());
        product.setMainImageUrl(resolvedMainImageUrl);
        product.setCategory(category);
        product.setActive(request.isActive());

        syncProductImages(product, request.getImages(), resolvedMainImageUrl);
        syncProductVariants(product, request.getVariants());
    }

    private String resolveMainImageUrl(CreateProductRequest request) {
        String directMainImageUrl = normalize(request.getMainImageUrl());
        if (directMainImageUrl != null) {
            return directMainImageUrl;
        }

        if (request.getImages() == null) {
            return null;
        }

        for (CreateProductRequest.ProductImageInput image : request.getImages()) {
            String imageUrl = normalize(image.getImageUrl());
            if (imageUrl != null && image.isMainImage()) {
                return imageUrl;
            }
        }

        for (CreateProductRequest.ProductImageInput image : request.getImages()) {
            String imageUrl = normalize(image.getImageUrl());
            if (imageUrl != null) {
                return imageUrl;
            }
        }

        return null;
    }

    private void syncProductImages(Product product, List<CreateProductRequest.ProductImageInput> requestedImages, String mainImageUrl) {
        product.getImages().clear();

        List<String> orderedUrls = new ArrayList<>();
        Set<String> seenUrls = new HashSet<>();

        if (mainImageUrl != null) {
            seenUrls.add(mainImageUrl);
            orderedUrls.add(mainImageUrl);
        }

        if (requestedImages != null) {
            for (CreateProductRequest.ProductImageInput image : requestedImages) {
                String imageUrl = normalize(image.getImageUrl());
                if (imageUrl != null && seenUrls.add(imageUrl)) {
                    orderedUrls.add(imageUrl);
                }
            }
        }

        for (String imageUrl : orderedUrls) {
            ProductImage image = new ProductImage();
            image.setImageUrl(imageUrl);
            image.setMainImage(imageUrl.equals(mainImageUrl));
            image.setProduct(product);
            product.getImages().add(image);
        }
    }

    private void syncProductVariants(Product product, List<CreateProductRequest.ProductVariantInput> requestedVariants) {
        product.getVariants().clear();

        if (requestedVariants == null) {
            return;
        }

        for (CreateProductRequest.ProductVariantInput requestedVariant : requestedVariants) {
            String variantName = normalize(requestedVariant.getName());
            if (variantName == null) {
                continue;
            }

            ProductVariant variant = new ProductVariant();
            variant.setName(variantName);
            variant.setPriceDelta(requestedVariant.getPriceDelta() == null ? BigDecimal.ZERO : requestedVariant.getPriceDelta());
            variant.setInStock(requestedVariant.isInStock());
            variant.setProduct(product);
            product.getVariants().add(variant);
        }
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private Map<String, Object> toAdminProduct(Product p) {
        Map<String, Object> product = new LinkedHashMap<>();
        product.put("id", p.getId());
        product.put("name", p.getName());
        product.put("nameHe", p.getNameHe() == null ? "" : p.getNameHe());
        product.put("description", p.getDescription() == null ? "" : p.getDescription());
        product.put("descriptionHe", p.getDescriptionHe() == null ? "" : p.getDescriptionHe());
        product.put("material", p.getMaterial() == null ? "" : p.getMaterial());
        product.put("price", p.getBasePrice() == null ? BigDecimal.ZERO : p.getBasePrice());
        product.put("mainImageUrl", p.getMainImageUrl() == null ? "" : p.getMainImageUrl());
        product.put("categoryId", p.getCategory().getId());
        product.put("categoryName", p.getCategory().getName());
        product.put("active", p.isActive());
        product.put("images", p.getImages().stream()
                .sorted(Comparator.comparing(ProductImage::isMainImage).reversed())
                .map(image -> {
                    Map<String, Object> imageData = new LinkedHashMap<>();
                    imageData.put("id", image.getId());
                    imageData.put("imageUrl", image.getImageUrl());
                    imageData.put("mainImage", image.isMainImage());
                    return imageData;
                })
                .toList());
        product.put("variants", p.getVariants().stream()
                .map(variant -> {
                    Map<String, Object> variantData = new LinkedHashMap<>();
                    variantData.put("id", variant.getId());
                    variantData.put("name", variant.getName());
                    variantData.put("priceDelta", variant.getPriceDelta() == null ? BigDecimal.ZERO : variant.getPriceDelta());
                    variantData.put("inStock", variant.isInStock());
                    return variantData;
                })
                .toList());
        return product;
    }
}