package com.ahmad.foryou.dto;

public class CategoryDTO {
    public Long id;
    public String name;
    public String nameHe;

    public CategoryDTO(Long id, String name, String nameHe) {
        this.id = id;
        this.name = name;
        this.nameHe = nameHe;
    }
}