# ForYou E-Commerce

ForYou is a small e-commerce project built for a home and fashion store. The backend is written with Spring Boot and PostgreSQL, and the frontend is plain HTML, CSS, and JavaScript.

The app already includes the customer-facing storefront, bilingual content support, seeded sample products, and a simple admin panel for managing products and categories.

## What is in the project

- Product catalog with categories, images, and variants
- English and Hebrew content support
- Static storefront pages served by the backend
- A lightweight admin panel with session-based login
- Sample data seeded on startup when the database is empty

## Stack

- **Backend:** Spring Boot
- **Database:** PostgreSQL
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Views:** Static assets plus a small Thymeleaf template setup

## Project layout

- `backend/` - Spring Boot application, REST controllers, services, repositories, templates, and static assets
- `frontend/` - development-side frontend pages and shared scripts/styles
- `AGENTS.md` - project conventions and architecture notes
- `CONTRIBUTING.md` - contribution workflow
- `LICENSE` - MIT license

## Main features

### Storefront
- Homepage with latest products
- Product listing and product details pages
- Category browsing
- Cart page
- Language switching for shared UI text

### Admin panel
- Admin login page
- Dashboard with simple store metrics
- Product create and edit flow
- Product activation and deactivation
- Category create and edit flow

The admin pages are served by the backend from the `static/` folder.

## Important routes

### Public pages
- `http://localhost:8080/`
- `http://localhost:8080/products.html`
- `http://localhost:8080/product.html?id={id}`
- `http://localhost:8080/category.html?id={id}`
- `http://localhost:8080/cart.html`

### Admin pages
- `http://localhost:8080/admin-login.html`
- `http://localhost:8080/admin-dashboard.html`
- `http://localhost:8080/admin-products.html`
- `http://localhost:8080/admin-categories.html`

### API endpoints
- `GET /api/products`
- `GET /api/products?categoryId=1`
- `GET /api/products?q=search-term`
- `GET /api/products/new`
- `GET /api/products/{id}`
- `GET /api/categories`
- `POST /api/admin/login`
- `GET /api/admin/check`
- `POST /api/admin/logout`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `PATCH /api/admin/products/{id}/active`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/{id}`

## What you need locally

- Java 21
- PostgreSQL running locally
- Windows PowerShell if you want to use the commands below as-is

## Configuration

Database settings are read from environment variables when they are provided:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `ADMIN_PASSWORD`

If you do not set them, the app falls back to the local development values defined in `backend/src/main/resources/application.properties`.

Example PowerShell setup:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/for-you"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password_here"
$env:ADMIN_PASSWORD="change-me"
```

For real deployment, do not rely on the local fallback values. Set your own environment variables instead.

## Running the project

### Run the backend

```powershell
Set-Location "C:\dev\Projects\foryou\backend"
.\mvnw.cmd spring-boot:run
```

Once it starts, the backend will be available at `http://localhost:8080`.

### Run the frontend during development

You have two easy options:

1. Open files directly from the `frontend/` folder in a browser.
2. Use Live Server or another simple static server for the `frontend/` folder while the backend is running on port `8080`.

The backend CORS setup already allows the common local frontend dev ports used in this project.

## Admin panel notes

The admin area uses a simple session-based login flow.

- Open `admin-login.html`
- Enter the admin password
- After login, the browser keeps the session cookie and the protected admin API becomes available

Protected admin API routes are blocked by `AdminSessionInterceptor`, so opening the pages without logging in will redirect you back to the login page.

## Localization

- UI text translations live in `frontend/js/translations.js`
- Shared language helpers live in `frontend/js/utils.js`
- The selected language is stored in `localStorage`

## Helpful files to know

- `backend/src/main/java/com/ahmad/foryou/database/Product.java`
- `backend/src/main/java/com/ahmad/foryou/services/ProductService.java`
- `backend/src/main/java/com/ahmad/foryou/services/CategoryService.java`
- `backend/src/main/java/com/ahmad/foryou/services/AdminAuthService.java`
- `backend/src/main/resources/application.properties`
- `backend/src/main/resources/static/admin/`
- `frontend/js/script.js`
- `frontend/js/translations.js`

## Troubleshooting

- **Backend cannot connect to PostgreSQL:** double-check your database is running and confirm the values used by `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.
- **Frontend pages cannot load products or categories:** make sure the backend is running on `http://localhost:8080`.
- **Admin page keeps redirecting to login:** the session is missing or expired. Log in again and make sure cookies are enabled.
- **Language text looks out of sync:** clear local storage and reload the page.
- **CORS errors during frontend development:** compare your frontend origin with the allowed origins in `WebConfig`.

## Tests

Run the backend tests with:

```powershell
Set-Location "C:\dev\Projects\foryou\backend"
.\mvnw.cmd test
```

## Contributing

If you want to contribute, please read `CONTRIBUTING.md` first. Small, focused changes are much easier to review than one large mixed commit.

## License

This project is licensed under the MIT License. See `LICENSE` for the full text.

