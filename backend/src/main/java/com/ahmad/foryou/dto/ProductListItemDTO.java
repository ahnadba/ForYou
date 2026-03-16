package com.ahmad.foryou.dto;

import java.math.BigDecimal;

public class ProductListItemDTO {
    public Long id;
    public String name;
    public BigDecimal price;        // basePrice for V1
    public String mainImageUrl;
    public Long categoryId;
    public String categoryName;

    public String nameHe;
    public String descriptionHe;
    public String categoryNameHe;

    public ProductListItemDTO(Long id, String name, BigDecimal price, String mainImageUrl,
                              Long categoryId, String categoryName, String nameHe, String descriptionHe, String categoryNameHe) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.mainImageUrl = mainImageUrl;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.nameHe = nameHe;
        this.descriptionHe = descriptionHe;
        this.categoryNameHe = categoryNameHe;
    }
}