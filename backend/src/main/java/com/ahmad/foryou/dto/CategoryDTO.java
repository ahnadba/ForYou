package com.ahmad.foryou.dto;

public class CategoryDTO {
    public Long id;
    public String name;
    public String nameHe;
    public String imageUrl;

    public CategoryDTO(Long id, String name, String nameHe, String imageUrl) {
        this.id = id;
        this.name = name;
        this.nameHe = nameHe;
        this.imageUrl = imageUrl;
    }
}