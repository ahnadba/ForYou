package com.ahmad.foryou.controllers;

import com.ahmad.foryou.dto.CreateProductRequest;
import com.ahmad.foryou.dto.ProductDetailsDTO;
import com.ahmad.foryou.dto.ProductListItemDTO;
import com.ahmad.foryou.services.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductListItemDTO> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "en") String lang
    ) {
        return productService.getProducts(categoryId, q, lang);
    }

    @GetMapping("/{id}")
    public ProductDetailsDTO getProduct(@PathVariable Long id, @RequestParam(defaultValue = "en") String lang) {
        return productService.getProductDetails(id, lang);
    }

    @GetMapping("/new")
    public List<ProductListItemDTO> getNewProducts(@RequestParam(defaultValue = "en") String lang) {
        return productService.getNewestProducts(lang);
    }

    @PostMapping
    public ProductDetailsDTO createProduct(@RequestBody CreateProductRequest request) {
        return productService.createProduct(request);
    }
}