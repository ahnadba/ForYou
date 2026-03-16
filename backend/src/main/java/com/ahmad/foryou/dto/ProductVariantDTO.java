package com.ahmad.foryou.dto;

import java.math.BigDecimal;

public class ProductVariantDTO {
    public Long id;
    public String name;
    public BigDecimal priceDelta;
    public boolean inStock;

    public ProductVariantDTO(Long id, String name, BigDecimal priceDelta, boolean inStock) {
        this.id = id;
        this.name = name;
        this.priceDelta = priceDelta;
        this.inStock = inStock;
    }
}