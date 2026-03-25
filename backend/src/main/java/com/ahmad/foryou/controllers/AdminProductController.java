package com.ahmad.foryou.controllers;

import com.ahmad.foryou.dto.CreateProductRequest;
import com.ahmad.foryou.services.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return productService.getProductsForAdmin();
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody CreateProductRequest request) {
        return productService.createProductForAdmin(request);
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody CreateProductRequest request) {
        return productService.updateProduct(id, request);
    }

    @PatchMapping("/{id}/active")
    public Map<String, Object> setActive(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        boolean active = Boolean.TRUE.equals(payload.get("active"));
        return productService.setProductActive(id, active);
    }
}


