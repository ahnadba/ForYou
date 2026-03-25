const productForm = document.getElementById("productForm");
const productTableBody = document.getElementById("productsTableBody");
const productFormTitle = document.getElementById("productFormTitle");
const productCancelEdit = document.getElementById("productCancelEdit");
const imagesList = document.getElementById("imagesList");
const variantsList = document.getElementById("variantsList");
const mainImageInput = document.getElementById("mainImageUrl");
const mainImagePreview = document.getElementById("mainImagePreview");
const addImageBtn = document.getElementById("addImageBtn");
const addVariantBtn = document.getElementById("addVariantBtn");

let adminProducts = [];

function updateMainImagePreview() {
  const imageUrl = (mainImageInput?.value || "").trim();
  if (!mainImagePreview) return;

  if (!imageUrl) {
    mainImagePreview.removeAttribute("src");
    mainImagePreview.classList.remove("is-visible");
    return;
  }

  mainImagePreview.src = imageUrl;
  mainImagePreview.classList.add("is-visible");
}

function createImageRow(image = {}) {
  const row = document.createElement("div");
  row.className = "row-card inline-fields image-row";
  row.innerHTML = `
    <div>
      <label>Image URL</label>
      <input type="text" class="image-url-input" value="${escapeHtml(image.imageUrl || "")}" />
    </div>
    <div>
      <label>Preview</label>
      <img class="mini-preview" alt="Product image preview" ${image.imageUrl ? `src="${escapeHtml(image.imageUrl)}"` : ""} />
    </div>
    <label class="checkbox-inline">
      <input type="radio" name="mainImageSelection" class="main-image-radio" ${image.mainImage ? "checked" : ""} />
      Main image
    </label>
    <button type="button" class="btn-danger remove-image-btn">Remove</button>
  `;

  const urlInput = row.querySelector(".image-url-input");
  const preview = row.querySelector(".mini-preview");
  const radio = row.querySelector(".main-image-radio");
  const removeBtn = row.querySelector(".remove-image-btn");

  urlInput.addEventListener("input", () => {
    const value = urlInput.value.trim();
    if (value) {
      preview.src = value;
    } else {
      preview.removeAttribute("src");
    }

    if (radio.checked) {
      mainImageInput.value = value;
      updateMainImagePreview();
    }
  });

  radio.addEventListener("change", () => {
    if (radio.checked) {
      mainImageInput.value = urlInput.value.trim();
      updateMainImagePreview();
    }
  });

  removeBtn.addEventListener("click", () => {
    const wasMain = radio.checked;
    row.remove();
    if (wasMain) {
      mainImageInput.value = "";
      const firstRadio = imagesList.querySelector(".main-image-radio");
      if (firstRadio) {
        firstRadio.checked = true;
        const firstUrlInput = firstRadio.closest(".image-row")?.querySelector(".image-url-input");
        mainImageInput.value = firstUrlInput?.value.trim() || "";
      }
      updateMainImagePreview();
    }
  });

  imagesList.appendChild(row);
}

function createVariantRow(variant = {}) {
  const row = document.createElement("div");
  row.className = "row-card inline-fields variant-row";
  row.innerHTML = `
    <div>
      <label>Variant Name</label>
      <input type="text" class="variant-name-input" value="${escapeHtml(variant.name || "")}" placeholder="Size M or Color: Red" />
    </div>
    <div>
      <label>Price Delta</label>
      <input type="number" class="variant-price-input" step="0.01" value="${escapeHtml(variant.priceDelta ?? 0)}" />
    </div>
    <label class="checkbox-inline">
      <input type="checkbox" class="variant-stock-input" ${variant.inStock !== false ? "checked" : ""} />
      In stock
    </label>
    <button type="button" class="btn-danger remove-variant-btn">Remove</button>
  `;

  row.querySelector(".remove-variant-btn").addEventListener("click", () => row.remove());
  variantsList.appendChild(row);
}

function collectImagesPayload() {
  return Array.from(imagesList.querySelectorAll(".image-row"))
    .map((row) => {
      const imageUrl = row.querySelector(".image-url-input")?.value.trim() || "";
      const mainImage = Boolean(row.querySelector(".main-image-radio")?.checked);
      return { imageUrl, mainImage };
    })
    .filter((image) => image.imageUrl);
}

function collectVariantsPayload() {
  return Array.from(variantsList.querySelectorAll(".variant-row"))
    .map((row) => {
      const name = row.querySelector(".variant-name-input")?.value.trim() || "";
      const priceDelta = Number(row.querySelector(".variant-price-input")?.value || 0);
      const inStock = Boolean(row.querySelector(".variant-stock-input")?.checked);
      return { name, priceDelta, inStock };
    })
    .filter((variant) => variant.name);
}

function resetProductForm() {
  productForm.reset();
  document.getElementById("productId").value = "";
  productFormTitle.textContent = "Add Product";
  productCancelEdit.style.display = "none";
  imagesList.innerHTML = "";
  variantsList.innerHTML = "";
  mainImageInput.value = "";
  updateMainImagePreview();
  createImageRow({ mainImage: true });
}

function fillProductForm(product) {
  document.getElementById("productId").value = product.id;
  document.getElementById("name").value = product.name || "";
  document.getElementById("nameHe").value = product.nameHe || "";
  document.getElementById("description").value = product.description || "";
  document.getElementById("descriptionHe").value = product.descriptionHe || "";
  document.getElementById("material").value = product.material || "";
  document.getElementById("price").value = product.price || "";
  document.getElementById("mainImageUrl").value = product.mainImageUrl || "";
  document.getElementById("categoryId").value = product.categoryId;
  document.getElementById("active").checked = !!product.active;

  imagesList.innerHTML = "";
  variantsList.innerHTML = "";

  const productImages = Array.isArray(product.images) && product.images.length
    ? product.images
    : [{ imageUrl: product.mainImageUrl || "", mainImage: true }];

  productImages.forEach((image, index) => {
    createImageRow({
      imageUrl: image.imageUrl || "",
      mainImage: index === 0 ? true : Boolean(image.mainImage),
    });
  });

  if (!productImages.length) {
    createImageRow({ mainImage: true });
  }

  (product.variants || []).forEach((variant) => createVariantRow(variant));

  productFormTitle.textContent = `Edit Product #${product.id}`;
  productCancelEdit.style.display = "inline-block";
  updateMainImagePreview();
}

function renderProducts() {
  if (!productTableBody) return;

  if (adminProducts.length === 0) {
    productTableBody.innerHTML = `<tr><td colspan="7" class="muted">No products yet.</td></tr>`;
    return;
  }

  productTableBody.innerHTML = adminProducts
    .map((product) => {
      const statusClass = product.active ? "active" : "inactive";
      const statusText = product.active ? "Active" : "Inactive";
      const toggleText = product.active ? "Deactivate" : "Activate";

      return `
        <tr>
          <td>${product.id}</td>
          <td>${escapeHtml(product.name)}</td>
          <td>${escapeHtml(product.categoryName || "-")}</td>
          <td>${escapeHtml(product.price)}</td>
          <td><span class="pill ${statusClass}">${statusText}</span></td>
          <td><button type="button" data-edit-id="${product.id}">Edit</button></td>
          <td><button type="button" data-toggle-id="${product.id}">${toggleText}</button></td>
        </tr>
      `;
    })
    .join("");

  document.querySelectorAll("[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.getAttribute("data-edit-id"));
      const product = adminProducts.find((item) => item.id === id);
      if (product) fillProductForm(product);
    });
  });

  document.querySelectorAll("[data-toggle-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = Number(button.getAttribute("data-toggle-id"));
      const product = adminProducts.find((item) => item.id === id);
      if (!product) return;

      await adminFetch(`/api/admin/products/${id}/active`, {
        method: "PATCH",
        body: JSON.stringify({ active: !product.active }),
      });

      await loadProducts();
    });
  });
}

async function loadCategoriesForProductForm() {
  const categorySelect = document.getElementById("categoryId");
  if (!categorySelect) return;

  const response = await adminFetch("/api/admin/categories");
  const categories = await response.json();

  categorySelect.innerHTML = categories
    .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
    .join("");
}

async function loadProducts() {
  const response = await adminFetch("/api/admin/products");
  adminProducts = await response.json();
  renderProducts();
}

document.addEventListener("DOMContentLoaded", async () => {
  const ok = await requireAdminAuth();
  if (!ok) return;

  markActiveAdminNav();
  wireAdminLogout();

  mainImageInput.addEventListener("input", () => {
    const firstRadio = imagesList.querySelector(".main-image-radio");
    if (firstRadio && !Array.from(imagesList.querySelectorAll(".main-image-radio")).some((radio) => radio.checked)) {
      firstRadio.checked = true;
    }
    updateMainImagePreview();
  });

  addImageBtn.addEventListener("click", () => createImageRow());
  addVariantBtn.addEventListener("click", () => createVariantRow({ inStock: true, priceDelta: 0 }));

  await loadCategoriesForProductForm();
  await loadProducts();
  resetProductForm();

  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const images = collectImagesPayload();
    const variants = collectVariantsPayload();
    const selectedMainImage = images.find((image) => image.mainImage)?.imageUrl || mainImageInput.value.trim();

    const payload = {
      name: document.getElementById("name").value,
      nameHe: document.getElementById("nameHe").value,
      description: document.getElementById("description").value,
      descriptionHe: document.getElementById("descriptionHe").value,
      material: document.getElementById("material").value,
      price: Number(document.getElementById("price").value || 0),
      mainImageUrl: selectedMainImage,
      categoryId: Number(document.getElementById("categoryId").value),
      active: document.getElementById("active").checked,
      images,
      variants,
    };

    const id = document.getElementById("productId").value;

    if (id) {
      await adminFetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await adminFetch("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    resetProductForm();
    await loadProducts();
  });

  productCancelEdit.addEventListener("click", resetProductForm);
});


