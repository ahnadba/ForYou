const API_URL =
  window.FORYOU_PRODUCTS_API_URL ||
  `${window.FORYOU_API_BASE_URL}/products`;

const productsGrid = document.getElementById("products-grid");

function getProductDisplayName(product) {
  if (typeof getLocalizedText === "function") {
    return getLocalizedText(product, "name", "Product");
  }
  return product?.name || "Product";
}

function updateProductsSubtitle() {
  const subtitleElement = document.getElementById("productsPageSubtitle");
  if (!subtitleElement) return;
  subtitleElement.textContent = getTranslation("productsPageSubtitle");
}

async function loadProducts() {
  if (!productsGrid) return;

  try {
    productsGrid.innerHTML = `<p class="loading-message">${getTranslation("loadingProducts")}</p>`;

    const response = await fetch(`${API_URL}?lang=${getCurrentLanguage()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Error loading products:", error);
    productsGrid.innerHTML = `
      <p class="error-message">${getTranslation("collectionLoadError")}</p>
    `;
  }
}

function renderProducts(products) {
  if (!productsGrid) return;

  if (!products || products.length === 0) {
    productsGrid.innerHTML = `
      <p class="empty-message">${getTranslation("noProducts")}</p>
    `;
    return;
  }

  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const imageUrl =
      product.mainImageUrl ||
      "https://via.placeholder.com/400x500?text=No+Image";
    const productName = getProductDisplayName(product);
    const productPrice = formatPrice(product.price);

    card.innerHTML = `
      <a class="product-link" href="./product.html?id=${product.id}">
        <div class="product-image-wrapper">
          <img src="${imageUrl}" alt="${productName}" />
        </div>
        <div class="product-info">
          <h3 class="product-name">${productName}</h3>
          <p class="product-price">${productPrice}</p>
        </div>
      </a>
    `;

    productsGrid.appendChild(card);
  });
}

updateCartCount();
updateLanguage();
initLanguageSelector();
updateProductsSubtitle();
loadProducts();

document.addEventListener("languageChanged", () => {
  updateProductsSubtitle();
  loadProducts();
});

// Initialize language selector is handled by script.js
