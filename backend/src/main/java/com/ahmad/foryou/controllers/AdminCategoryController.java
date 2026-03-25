package com.ahmad.foryou.controllers;

import com.ahmad.foryou.dto.AdminCategoryRequest;
import com.ahmad.foryou.dto.CategoryDTO;
import com.ahmad.foryou.services.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final CategoryService categoryService;

    public AdminCategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDTO> getAll() {
        return categoryService.getAllForAdmin();
    }

    @PostMapping
    public CategoryDTO create(@RequestBody AdminCategoryRequest request) {
        return categoryService.createCategory(request.getName(), request.getNameHe(), request.getImageUrl());
    }

    @PutMapping("/{id}")
    public CategoryDTO update(@PathVariable Long id, @RequestBody AdminCategoryRequest request) {
        return categoryService.updateCategory(id, request.getName(), request.getNameHe(), request.getImageUrl());
    }
}


