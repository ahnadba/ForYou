const categoryCreateForm = document.getElementById("categoryCreateForm");
const categoriesTableBody = document.getElementById("categoriesTableBody");

let adminCategories = [];

function renderCategories() {
  if (!categoriesTableBody) return;

  if (!adminCategories.length) {
    categoriesTableBody.innerHTML = `<tr><td colspan="5" class="muted">No categories yet.</td></tr>`;
    return;
  }

  categoriesTableBody.innerHTML = adminCategories
    .map(
      (category) => `
        <tr>
          <td>${category.id}</td>
          <td><input type="text" value="${escapeHtml(category.name || "")}" data-name-id="${category.id}" /></td>
          <td><input type="text" value="${escapeHtml(category.nameHe || "")}" data-name-he-id="${category.id}" /></td>
          <td><input type="text" value="${escapeHtml(category.imageUrl || "")}" data-image-id="${category.id}" /></td>
          <td><button type="button" data-save-id="${category.id}">Save</button></td>
        </tr>
      `,
    )
    .join("");

  document.querySelectorAll("[data-save-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = Number(button.getAttribute("data-save-id"));
      const name = document.querySelector(`[data-name-id=\"${id}\"]`).value;
      const nameHe = document.querySelector(`[data-name-he-id=\"${id}\"]`).value;
      const imageUrl = document.querySelector(`[data-image-id=\"${id}\"]`).value;

      await adminFetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name, nameHe, imageUrl }),
      });

      await loadCategories();
    });
  });
}

async function loadCategories() {
  const response = await adminFetch("/api/admin/categories");
  adminCategories = await response.json();
  renderCategories();
}

document.addEventListener("DOMContentLoaded", async () => {
  const ok = await requireAdminAuth();
  if (!ok) return;

  markActiveAdminNav();
  wireAdminLogout();

  await loadCategories();

  categoryCreateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      name: document.getElementById("newCategoryName").value,
      nameHe: document.getElementById("newCategoryNameHe").value,
      imageUrl: document.getElementById("newCategoryImageUrl").value,
    };

    await adminFetch("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    categoryCreateForm.reset();
    await loadCategories();
  });
});


