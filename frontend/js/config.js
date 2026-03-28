/**
 * API base URL — single source of truth.
 *
 * Auto-detects environment so no manual changes are needed when switching
 * between local development and production (Vercel + Render).
 *
 *  • Local dev  (localhost / 127.0.0.1)  →  Spring Boot on port 8080
 *  • Production (any other hostname)     →  Render backend
 *
 * When your Render app name is known, replace <my-backend> below.
 */
window.FORYOU_API_BASE_URL = (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
)
  ? "http://localhost:8080/api"
  : "https://<my-backend>.onrender.com/api";

