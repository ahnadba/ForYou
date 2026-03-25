const ADMIN_LOGIN_PATH = "/admin-login.html";

async function adminFetch(url, options = {}) {
  const requestOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  const response = await fetch(url, requestOptions);

  if (response.status === 401) {
    window.location.href = ADMIN_LOGIN_PATH;
    throw new Error("Unauthorized");
  }

  return response;
}

async function checkAdminSession() {
  const response = await fetch("/api/admin/check", { credentials: "include" });
  if (!response.ok) return false;
  const data = await response.json();
  return Boolean(data.authenticated);
}

async function requireAdminAuth() {
  const authenticated = await checkAdminSession();
  if (!authenticated) {
    window.location.href = ADMIN_LOGIN_PATH;
    return false;
  }
  return true;
}

function markActiveAdminNav() {
  const currentPath = window.location.pathname;
  document.querySelectorAll("[data-admin-nav]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && currentPath.endsWith(href)) {
      link.classList.add("active");
    }
  });
}

function wireAdminLogout(buttonId = "adminLogoutBtn") {
  const button = document.getElementById(buttonId);
  if (!button) return;

  button.addEventListener("click", async () => {
    try {
      await adminFetch("/api/admin/logout", { method: "POST" });
    } catch (error) {
      // Ignore logout errors and still redirect to login.
    }
    window.location.href = ADMIN_LOGIN_PATH;
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

