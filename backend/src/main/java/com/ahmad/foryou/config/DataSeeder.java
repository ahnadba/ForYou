package com.ahmad.foryou.config;

import com.ahmad.foryou.database.*;
import com.ahmad.foryou.repositories.CategoryRepository;
import com.ahmad.foryou.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataSeeder(CategoryRepository categoryRepository,
                      ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {

        if (productRepository.count() > 0) return; // don't duplicate on restart

        // ===== Categories =====
        Category pajamas = new Category();
        pajamas.setName("Pajamas");
        pajamas.setNameHe("פיג'מות");
        pajamas.setImageUrl("https://picsum.photos/seed/pajama-category/900/1100");
        pajamas.setActive(true);

        Category bedsheets = new Category();
        bedsheets.setName("Bedsheets");
        bedsheets.setNameHe("סדינים");
        bedsheets.setImageUrl("https://picsum.photos/seed/bedsheet-category/900/1100");
        bedsheets.setActive(true);

        categoryRepository.saveAll(List.of(pajamas, bedsheets));

        // ===== Product 1 =====
        Product silkPajama = new Product();
        silkPajama.setName("Luxury Silk Pajama Set");
        silkPajama.setNameHe("סט פיג'מה משי יוקרתי");
        silkPajama.setDescription("Premium silk pajama set with soft touch and elegant fit. Perfect for Ramadan nights.");
        silkPajama.setDescriptionHe("סט פיג'מה משי פרימיום עם מגע רך והתאמה אלגנטית. מושלם ללילות רמדאן.");
        silkPajama.setMaterial("100% Silk");
        silkPajama.setBasePrice(new BigDecimal("299.00"));
        silkPajama.setCategory(pajamas);
        silkPajama.setMainImageUrl("https://picsum.photos/seed/pajama1/1200/1500");
        silkPajama.setCreatedAt(LocalDateTime.now());
        silkPajama.setUpdatedAt(LocalDateTime.now());
        silkPajama.setActive(true);

        ProductImage img1 = new ProductImage();
        img1.setImageUrl("https://picsum.photos/seed/pajama1/1200/1500");
        img1.setMainImage(true);
        img1.setProduct(silkPajama);

        silkPajama.setImages(List.of(img1));

        ProductVariant v1 = new ProductVariant();
        v1.setName("Size M");
        v1.setPriceDelta(BigDecimal.ZERO);
        v1.setInStock(true);
        v1.setProduct(silkPajama);

        ProductVariant v2 = new ProductVariant();
        v2.setName("Size L");
        v2.setPriceDelta(new BigDecimal("20"));
        v2.setInStock(true);
        v2.setProduct(silkPajama);

        silkPajama.setVariants(List.of(v1, v2));

        // ===== Product 2 =====
        Product cottonSheet = new Product();
        cottonSheet.setName("Egyptian Cotton Bedsheet");
        cottonSheet.setNameHe("סדין כותנה מצרית");
        cottonSheet.setDescription("Soft Egyptian cotton bedsheet with breathable fabric for ultimate comfort.");
        cottonSheet.setDescriptionHe("סדין כותנה מצרית רך עם בד נושם לנוחות מקסימלית.");
        cottonSheet.setMaterial("Egyptian Cotton");
        cottonSheet.setBasePrice(new BigDecimal("189.00"));
        cottonSheet.setCategory(bedsheets);
        cottonSheet.setMainImageUrl("https://picsum.photos/seed/bedsheet1/1200/1500");
        cottonSheet.setCreatedAt(LocalDateTime.now());
        cottonSheet.setUpdatedAt(LocalDateTime.now());
        cottonSheet.setActive(true);

        ProductImage img2 = new ProductImage();
        img2.setImageUrl("https://picsum.photos/seed/bedsheet1/1200/1500");
        img2.setMainImage(true);
        img2.setProduct(cottonSheet);

        cottonSheet.setImages(List.of(img2));

        productRepository.saveAll(List.of(silkPajama, cottonSheet));
    }
}