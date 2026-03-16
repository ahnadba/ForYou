package com.ahmad.foryou.services;

import com.ahmad.foryou.dto.CategoryDTO;
import com.ahmad.foryou.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAll(String lang) {
        return categoryRepository.findAll().stream()
                .filter(c -> c.isActive())
                .map(c -> {
                    String name = lang.equals("he") && c.getNameHe() != null && !c.getNameHe().isEmpty() ? c.getNameHe() : c.getName();
                    return new CategoryDTO(c.getId(), name, c.getNameHe());
                })
                .toList();
    }
}