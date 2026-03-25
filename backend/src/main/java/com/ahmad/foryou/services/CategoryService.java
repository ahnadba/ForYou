package com.ahmad.foryou.services;

import com.ahmad.foryou.database.Category;
import com.ahmad.foryou.dto.CategoryDTO;
import com.ahmad.foryou.repositories.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAll(String lang) {
        return categoryRepository.findAll().stream()
                .filter(Category::isActive)
                .map(c -> {
                    String name = lang.equals("he") && c.getNameHe() != null && !c.getNameHe().isEmpty() ? c.getNameHe() : c.getName();
                    return new CategoryDTO(c.getId(), name, c.getNameHe(), c.getImageUrl());
                })
                .toList();
    }

    public List<CategoryDTO> getAllForAdmin() {
        return categoryRepository.findAll().stream()
                .sorted(Comparator.comparingLong(Category::getId))
                .map(c -> new CategoryDTO(c.getId(), c.getName(), c.getNameHe(), c.getImageUrl()))
                .toList();
    }

    public CategoryDTO createCategory(String name, String nameHe, String imageUrl) {
        Category category = new Category();
        category.setName(name);
        category.setNameHe(nameHe);
        category.setImageUrl(imageUrl);
        category.setActive(true);
        Category saved = categoryRepository.save(category);
        return new CategoryDTO(saved.getId(), saved.getName(), saved.getNameHe(), saved.getImageUrl());
    }

    public CategoryDTO updateCategory(Long id, String name, String nameHe, String imageUrl) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        category.setName(name);
        category.setNameHe(nameHe);
        category.setImageUrl(imageUrl);
        Category saved = categoryRepository.save(category);
        return new CategoryDTO(saved.getId(), saved.getName(), saved.getNameHe(), saved.getImageUrl());
    }
}