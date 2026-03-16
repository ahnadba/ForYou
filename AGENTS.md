# AGENTS.md - ForYou E-Commerce Project

## Architecture Overview
- **Backend**: Spring Boot 4.1.0-SNAPSHOT app with JPA (PostgreSQL), REST API, and Thymeleaf MVC views
- **Frontend**: Static HTML/CSS/JS served by backend, with separate dev files in `frontend/`
- **Data Model**: Products with variants (size/color, price deltas), images, categories; seeded via `DataSeeder` on startup
- **Key Entities**: `Product` (with `variants`, `images`), `Category`, `ProductVariant`, `ProductImage`
- **API Structure**: `/api/products`, `/api/categories`; CORS enabled for dev ports (5500, 3000, 5173)

## Developer Workflows
- **Run Backend**: `.\backend\mvnw.cmd spring-boot:run` (Windows); starts on port 8080, serves static frontend
- **Database**: PostgreSQL on localhost:5432; `ddl-auto=update`; SQL logging enabled in `application.properties`
- **Debugging**: Enable Hibernate SQL tracing; check actuator endpoints at `/actuator/`
- **Frontend Dev**: Open `frontend/index.html` in browser or VS Code Live Server (port 5500)

## Code Conventions
- **Entities**: In `database/` package; use `@PrePersist/@PreUpdate` for timestamps; lazy fetch for relations
- **Repositories**: Extend `JpaRepository`; use `@EntityGraph` for eager fetching (e.g., category in `ProductRepository`)
- **Services**: Business logic in `services/`; map entities to DTOs (`dto/` package)
- **Controllers**: REST with `@CrossOrigin`; inject services; return DTOs
- **DTOs**: Separate request/response DTOs (e.g., `CreateProductRequest`, `ProductDetailsDTO`)
- **Variants**: Products have base price + variant deltas; variants have stock status
- **Images**: Main image URL on product; additional images in `ProductImage` list

## Examples
- Add product variant: In `ProductService.createProduct()`, create `ProductVariant` with `priceDelta` and attach to product
- Fetch products: Use repository methods like `findByActiveTrueAndCategory_IdOrderByCreatedAtDesc()`
- CORS: Configured in `WebConfig` for dev origins; controllers have `@CrossOrigin` for Live Server
- Seeding: `DataSeeder` runs on startup if no products; creates sample pajamas/bedsheets with variants

## Key Files
- `backend/src/main/java/com/ahmad/foryou/database/Product.java` - Core entity with relations
- `backend/src/main/java/com/ahmad/foryou/services/ProductService.java` - Business logic example
- `backend/src/main/resources/application.properties` - DB config and logging
- `frontend/js/products.js` - Frontend API calls to `/api/products`
