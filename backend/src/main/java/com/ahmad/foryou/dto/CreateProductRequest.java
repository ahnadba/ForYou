package com.ahmad.foryou.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CreateProductRequest {

    private String name;
    private String nameHe;
    private String description;
    private String descriptionHe;
    private BigDecimal price;
    private String mainImageUrl;
    private String material;
    private Long categoryId;
    private boolean active;
    private List<ProductImageInput> images = new ArrayList<>();
    private List<ProductVariantInput> variants = new ArrayList<>();

    public CreateProductRequest() {
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<ProductImageInput> getImages() {
        return images;
    }

    public void setImages(List<ProductImageInput> images) {
        this.images = images == null ? new ArrayList<>() : images;
    }

    public List<ProductVariantInput> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariantInput> variants) {
        this.variants = variants == null ? new ArrayList<>() : variants;
    }

    public static class ProductImageInput {
        private String imageUrl;
        private boolean mainImage;

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public boolean isMainImage() {
            return mainImage;
        }

        public void setMainImage(boolean mainImage) {
            this.mainImage = mainImage;
        }
    }

    public static class ProductVariantInput {
        private String name;
        private BigDecimal priceDelta;
        private boolean inStock;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public BigDecimal getPriceDelta() {
            return priceDelta;
        }

        public void setPriceDelta(BigDecimal priceDelta) {
            this.priceDelta = priceDelta;
        }

        public boolean isInStock() {
            return inStock;
        }

        public void setInStock(boolean inStock) {
            this.inStock = inStock;
        }
    }
}