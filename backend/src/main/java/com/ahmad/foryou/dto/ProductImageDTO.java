package com.ahmad.foryou.dto;

public class ProductImageDTO {
    public Long id;
    public String imageUrl;
    public boolean mainImage;

    public ProductImageDTO(Long id, String imageUrl, boolean mainImage) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.mainImage = mainImage;
    }
}