# ForYou E-Commerce

ForYou is a beginner-friendly e-commerce project for a women's store, built with a Spring Boot backend, PostgreSQL, and a vanilla HTML/CSS/JavaScript frontend.

## Tech Stack
- Backend: Spring Boot (REST API + static assets/Thymeleaf)
- Database: PostgreSQL
- Frontend: HTML, CSS, Vanilla JavaScript

## Project Structure
- `backend/` - Spring Boot app (controllers, services, repositories, entities, DTOs)
- `frontend/` - frontend pages and scripts used during development
- `AGENTS.md` - project-specific implementation conventions
- `CONTRIBUTING.md` - contribution workflow
- `LICENSE` - project license

## Architecture Snapshot
- Product catalog with categories, variants, and images.
- API endpoints are grouped under:
  - `/api/products`
  - `/api/categories`
- Startup seed logic is handled by `backend/src/main/java/com/ahmad/foryou/config/DataSeeder.java`.

## Prerequisites
- Java 21
- PostgreSQL running locally
- Windows PowerShell (commands below use PowerShell)

## Environment Variables
`backend/src/main/resources/application.properties` reads DB settings from environment variables:

- `DB_URL` (default: `jdbc:postgresql://localhost:5432/for-you`)
- `DB_USERNAME` (default: `postgres`)
- `DB_PASSWORD` (default: empty)

Set these before running the backend:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/for-you"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password_here"
```

## Quick Start

### 1) Run the backend
```powershell
Set-Location "C:\dev\Projects\foryou\backend"
.\mvnw.cmd spring-boot:run
```

From current project conventions, the backend is expected on `http://localhost:8080`.

### 2) Run/view frontend
Use one of these approaches:

1. Open `frontend/index.html` directly in a browser (simple preview).
2. Use VS Code Live Server (often port `5500`) while backend runs on `8080`.

## API Quick Reference

### Products
```http
GET /api/products
GET /api/products?categoryId=1
GET /api/products/{id}
```

### Categories
```http
GET /api/categories
```

## Localization
- Static UI labels are in `frontend/js/translations.js`.
- Shared localization and helper logic is in `frontend/js/utils.js`.
- Current language is persisted in `localStorage`.

## Key Files
- `backend/src/main/java/com/ahmad/foryou/database/Product.java`
- `backend/src/main/java/com/ahmad/foryou/services/ProductService.java`
- `backend/src/main/resources/application.properties`
- `frontend/js/products.js`
- `frontend/js/script.js`

## Troubleshooting
- **Backend cannot connect to DB**: check `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and PostgreSQL status.
- **Products/categories do not load**: verify backend is running and frontend API URLs point to `http://localhost:8080/api`.
- **Language switch appears inconsistent**: clear browser localStorage and reload.
- **CORS errors during frontend dev**: compare frontend origin and backend CORS settings in `WebConfig` and controller `@CrossOrigin` annotations.

## Contributing and License
- Read `CONTRIBUTING.md` for branch/PR workflow.
- Project is licensed under `LICENSE` (MIT).

## Roadmap
- Add screenshots for homepage, products, category, and cart.
- Add API response examples for each endpoint.
- Add CI checks for backend tests and frontend linting.

