package com.ahmad.foryou.controllers;

import com.ahmad.foryou.dto.CategoryDTO;
import com.ahmad.foryou.services.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDTO> getAll(@RequestParam(defaultValue = "en") String lang) {
        return categoryService.getAll(lang);
    }
}