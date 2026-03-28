# ForYou

A small e-commerce store for home and fashion products. Spring Boot backend with a plain HTML/CSS/JS frontend and a lightweight admin panel.

## Stack

- **Backend:** Spring Boot, JPA, PostgreSQL
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Admin panel:** Static HTML served by the backend, session-based login

## Project structure

```
backend/     Spring Boot app — REST API, admin panel, static assets
frontend/    Customer-facing storefront (deployed on Vercel)
migrations/  One-off SQL scripts (reference only, not auto-run)
```

The admin panel lives inside `backend/src/main/resources/static/` and is served by Spring Boot.

## Running locally

**Requirements:** Java 21, PostgreSQL

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Starts on `http://localhost:8080`. The storefront and admin panel are both available from there.

For storefront development, you can also open files from `frontend/` directly in a browser or serve the folder with a static server (e.g. VS Code Live Server on port 5500). The backend CORS config already allows the common local dev ports.

## Environment variables

| Variable | Required in prod | Purpose |
|---|---|---|
| `DB_URL` | Yes | PostgreSQL connection string |
| `DB_USERNAME` | Yes | Database username |
| `DB_PASSWORD` | Yes | Database password |
| `ADMIN_PASSWORD` | Yes | Admin panel password |
| `SPRING_PROFILES_ACTIVE` | Yes | Set to `prod` to activate the production config |
| `APP_ALLOWED_ORIGINS` | Yes | Comma-separated CORS origins (your Vercel frontend URL) |

Locally, the app falls back to the defaults in `application.properties` if these are not set. In production (`SPRING_PROFILES_ACTIVE=prod`), the app will refuse to start if the first four are missing.

Local PowerShell example:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/for-you"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password_here"
$env:ADMIN_PASSWORD="change-me"
```

## Deployment

The project runs as two separate services.

### Backend → Render

1. Create a PostgreSQL database on Render. Note the internal connection string.
2. Create a Web Service pointed at the `backend/` folder.
   - Build command: `./mvnw clean package -DskipTests`
   - Start command: `java -jar target/foryou-0.0.1-SNAPSHOT.jar`
3. Set all six environment variables from the table above.
4. Deploy and note your backend URL (e.g. `https://your-app.onrender.com`).

### Frontend → Vercel

1. In `frontend/js/config.js`, replace `<my-backend>` with your actual Render app name.
2. Commit that change.
3. Create a Vercel project connected to this repo.
   - Root directory: `frontend`
   - Framework preset: `Other`
4. Deploy.

After both are live, update `APP_ALLOWED_ORIGINS` on Render to your Vercel URL and redeploy the backend.

The admin panel is served by the backend — access it at `https://your-app.onrender.com/admin-login.html`. It is not part of the Vercel deployment.

## Admin panel

- Login at `/admin-login.html`
- Manage products and categories
- Session cookie keeps you logged in until you log out or the session expires

## API endpoints

```
GET   /api/products
GET   /api/products?categoryId={id}
GET   /api/products?q={term}
GET   /api/products/new
GET   /api/products/{id}
GET   /api/categories
POST  /api/admin/login
GET   /api/admin/check
POST  /api/admin/logout
GET   /api/admin/products
POST  /api/admin/products
PUT   /api/admin/products/{id}
PATCH /api/admin/products/{id}/active
GET   /api/admin/categories
POST  /api/admin/categories
PUT   /api/admin/categories/{id}
```

## Key files

```
backend/src/main/java/com/ahmad/foryou/config/WebConfig.java         CORS config
backend/src/main/java/com/ahmad/foryou/config/DataSeeder.java         Sample data on startup
backend/src/main/java/com/ahmad/foryou/services/ProductService.java   Product business logic
backend/src/main/resources/application.properties                     Base config + local defaults
backend/src/main/resources/application-prod.properties                Production overrides
frontend/js/config.js                                                  Frontend API base URL
frontend/js/translations.js                                            UI text (English + Hebrew)
```

## Troubleshooting

- **Backend won't connect to PostgreSQL** — check that Postgres is running and your `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` values are correct.
- **Frontend shows no products** — make sure the backend is running on port 8080.
- **Admin page redirects to login** — session expired or cookies are disabled. Log in again.
- **CORS errors in the browser** — check that your frontend origin is in `APP_ALLOWED_ORIGINS` (or the `app.cors.allowed-origins` default in `application.properties` for local dev).
- **Language text out of sync** — clear localStorage and reload.

## Tests

```powershell
cd backend
.\mvnw.cmd test
```

## Contributing

See `CONTRIBUTING.md`.

## License

MIT. See `LICENSE`.

