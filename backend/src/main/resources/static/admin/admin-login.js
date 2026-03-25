document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("adminLoginForm");
  const passwordInput = document.getElementById("adminPassword");
  const errorBox = document.getElementById("adminLoginError");

  if (!form || !passwordInput || !errorBox) return;

  const isLoggedIn = await checkAdminSession();
  if (isLoggedIn) {
    window.location.href = "/admin-dashboard.html";
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBox.textContent = "";

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.value }),
      });

      if (!response.ok) {
        errorBox.textContent = "Wrong password. Please try again.";
        return;
      }

      window.location.href = "/admin-dashboard.html";
    } catch (error) {
      errorBox.textContent = "Login failed. Please check server connection.";
    }
  });
});

