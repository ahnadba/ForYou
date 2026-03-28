const CATEGORIES_ENDPOINT =
  window.FORYOU_CATEGORIES_API_URL ||
  `${window.FORYOU_API_BASE_URL}/categories`;
const PRODUCTS_ENDPOINT =
  window.FORYOU_PRODUCTS_API_URL ||
  `${window.FORYOU_API_BASE_URL}/products`;

const categoryTitle = document.getElementById("categoryTitle");
const categorySubtitle = document.getElementById("categorySubtitle");
const categoryProductsGrid = document.getElementById("categoryProductsGrid");

function getCategoryIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getCategoryDisplayName(category, fallback = "Category") {
  if (typeof getLocalizedText === "function") {
    return getLocalizedText(category, "name", fallback);
  }
  return category?.name || fallback;
}

function buildCategorySubtitle(categoryName) {
  return getTranslation("browseCategoryCollection").replace("{category}", categoryName);
}

function renderCategoryProducts(products) {
  if (!categoryProductsGrid) return;

  if (!Array.isArray(products) || products.length === 0) {
    categoryProductsGrid.innerHTML = `<p class="category-empty">${getTranslation("noProductsInCategory")}</p>`;
    return;
  }

  categoryProductsGrid.innerHTML = products
    .map((product) => {
      const productName = getCategoryDisplayName(product, "Product");
      return `
      <a class="category-product-card" href="./product.html?id=${product.id}">
        <img
          src="${product.mainImageUrl || "https://via.placeholder.com/600x700?text=No+Image"}"
          alt="${escapeHtml(productName)}"
        >
        <div class="category-product-card-body">
          <h3>${escapeHtml(productName)}</h3>
          <p>${formatPrice(product.price)}</p>
        </div>
      </a>
    `;
    })
    .join("");
}

/**
 * Uses backend category filtering endpoint: /api/products?categoryId=...
 * This keeps filtering on the server and keeps results language-aware.
 */
async function loadCategoryPage() {
  const categoryId = getCategoryIdFromUrl();

  if (!categoryId) {
    if (categoryTitle) categoryTitle.textContent = getTranslation("categoryNotFound");
    if (categorySubtitle) categorySubtitle.textContent = getTranslation("missingCategoryId");
    if (categoryProductsGrid) {
      categoryProductsGrid.innerHTML = `<p class="category-error">${getTranslation("missingCategoryId")}</p>`;
    }
    return;
  }

  try {
    const currentLanguage = getCurrentLanguage();
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetch(`${CATEGORIES_ENDPOINT}?lang=${currentLanguage}`),
      fetch(`${PRODUCTS_ENDPOINT}?categoryId=${categoryId}&lang=${currentLanguage}`),
    ]);

    const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];
    const products = productsResponse.ok ? await productsResponse.json() : [];

    const currentCategory = Array.isArray(categories)
      ? categories.find((category) => String(category.id) === String(categoryId))
      : null;

    const derivedCategoryName = currentCategory
      ? getCategoryDisplayName(currentCategory)
      : products[0]?.categoryName || getTranslation("categoryNotFound");

    if (categoryTitle) categoryTitle.textContent = derivedCategoryName;
    if (categorySubtitle) {
      categorySubtitle.textContent = buildCategorySubtitle(derivedCategoryName);
    }

    renderCategoryProducts(products);
  } catch (error) {
    console.error("Error loading category page:", error);
    if (categoryProductsGrid) {
      categoryProductsGrid.innerHTML = `<p class="category-error">${getTranslation("categoryProductsLoadError")}</p>`;
    }
  }
}

document.addEventListener("languageChanged", loadCategoryPage);

updateCartCount();
updateLanguage();
initLanguageSelector();
loadCategoryPage();

