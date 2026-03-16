package com.ahmad.foryou.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductDetailsDTO {
    public Long id;
    public String name;
    public String description;
    public String material;
    public BigDecimal basePrice;
    private String mainImageUrl;
    public Long categoryId;
    public String categoryName;

    public List<ProductImageDTO> images;
    public List<ProductVariantDTO> variants;

    public String nameHe;
    public String descriptionHe;
    public String categoryNameHe;

    public ProductDetailsDTO(Long id, String name, String description, String material, BigDecimal basePrice, String mainImageUrl,
                             Long categoryId, String categoryName,
                             List<ProductImageDTO> images, List<ProductVariantDTO> variants,
                             String nameHe, String descriptionHe, String categoryNameHe) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.material = material;
        this.basePrice = basePrice;
        this.mainImageUrl= mainImageUrl;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.images = images;
        this.variants = variants;
        this.nameHe = nameHe;
        this.descriptionHe = descriptionHe;
        this.categoryNameHe = categoryNameHe;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public List<ProductImageDTO> getImages() {
        return images;
    }

    public void setImages(List<ProductImageDTO> images) {
        this.images = images;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<ProductVariantDTO> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariantDTO> variants) {
        this.variants = variants;
    }

    public String getNameHe() {
        return nameHe;
    }

    public void setNameHe(String nameHe) {
        this.nameHe = nameHe;
    }

    public String getDescriptionHe() {
        return descriptionHe;
    }

    public void setDescriptionHe(String descriptionHe) {
        this.descriptionHe = descriptionHe;
    }

    public String getCategoryNameHe() {
        return categoryNameHe;
    }

    public void setCategoryNameHe(String categoryNameHe) {
        this.categoryNameHe = categoryNameHe;
    }
}