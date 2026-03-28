const PRODUCTS_API_BASE_URL =
  window.FORYOU_PRODUCTS_API_URL ||
  `${window.FORYOU_API_BASE_URL}/products`;
const productContainer = document.getElementById("product-container");

let selectedOptions = {};
let currentProduct = null;

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || params.get("productId");
}

function getProductDisplayName(product, fallback) {
  if (typeof getLocalizedText === "function") {
    return getLocalizedText(product, "name", fallback);
  }
  return product?.name || fallback;
}

function getProductDescription(product) {
  if (typeof getLocalizedText === "function") {
    return getLocalizedText(product, "description", getTranslation("noDescription"));
  }
  return product?.description || getTranslation("noDescription");
}

async function loadProduct() {
  const productId = getProductIdFromUrl();

  if (!productContainer) return;

  if (!productId) {
    productContainer.innerHTML = `<p class="error-message">${getTranslation("productIdMissing")}</p>`;
    return;
  }

  productContainer.innerHTML = `<p class="loading-message">${getTranslation("loadingProduct")}</p>`;

  try {
    // Keep dynamic content language-aware by passing current language to backend.
    let response = await fetch(`${PRODUCTS_API_BASE_URL}/${productId}?lang=${getCurrentLanguage()}`);

    // Fallback to default endpoint if a language-specific response fails.
    if (!response.ok) {
      response = await fetch(`${PRODUCTS_API_BASE_URL}/${productId}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const product = await response.json();
    currentProduct = product;
    renderProduct(product);
  } catch (error) {
    console.error("Error loading product:", error);
    productContainer.innerHTML = `<p class="error-message">${getTranslation("productLoadError")}</p>`;
  }
}

function renderProduct(product) {
  if (!productContainer) return;

  const imageList = buildImageList(product);
  const mainImage =
    imageList.length > 0
      ? imageList[0]
      : "https://via.placeholder.com/600x700?text=No+Image";

  const productName = getProductDisplayName(product, getTranslation("unnamedProduct"));
  const productDescription = getProductDescription(product);
  const productMaterial = product.material || getTranslation("notSpecified");
  const basePrice = product.basePrice ?? product.price;

  const variantsHtml = buildVariantsHtml(product.variants || []);
  const thumbnailsHtml = buildThumbnailsHtml(imageList);

  productContainer.innerHTML = `
    <div class="product-layout">
      <div class="product-gallery">
        <div class="main-image-wrapper">
          <img
            id="main-product-image"
            src="${escapeHtml(mainImage)}"
            alt="${escapeHtml(productName)}"
          >
        </div>

        <div class="thumbnail-row">
          ${thumbnailsHtml}
        </div>
      </div>

      <div class="product-details">
        <h1 class="product-title">${escapeHtml(productName)}</h1>
        <p class="product-price">${formatPrice(basePrice)}</p>

        <div>
          <h3 class="product-section-title">${getTranslation("productSectionDescription")}</h3>
          <p class="product-description">
            ${escapeHtml(productDescription)}
          </p>
        </div>

        <div>
          <h3 class="product-section-title">${getTranslation("productSectionMaterial")}</h3>
          <p class="product-material">
            ${escapeHtml(productMaterial)}
          </p>
        </div>

        <div>
          <h3 class="product-section-title">${getTranslation("productSectionOptions")}</h3>
          <div class="variant-groups">
            ${variantsHtml}
          </div>
        </div>

        <button class="add-to-cart-btn" id="add-to-cart-btn">
          ${getTranslation("addToCart")}
        </button>
      </div>
    </div>
  `;

  setupThumbnailClicks();
  setupVariantSelection();
  setupAddToCart(product);
}

function buildImageList(product) {
  const images = [];

  if (product.mainImageUrl) {
    images.push(product.mainImageUrl);
  }

  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (img && img.imageUrl && !images.includes(img.imageUrl)) {
        images.push(img.imageUrl);
      }
    });
  }

  return images;
}

function buildThumbnailsHtml(imageList) {
  if (!imageList.length) {
    return "";
  }

  return imageList
    .map((imageUrl, index) => {
      return `
        <button
          type="button"
          class="thumbnail ${index === 0 ? "active" : ""}"
          data-image="${escapeHtml(imageUrl)}"
        >
          <img src="${escapeHtml(imageUrl)}" alt="Product thumbnail ${index + 1}">
        </button>
      `;
    })
    .join("");
}

function groupVariantsByType(variants) {
  const grouped = {};

  variants.forEach((variant) => {
    if (!variant || !variant.name) return;

    const rawName = String(variant.name)
      .replace(/^['\"]|['\"]$/g, "")
      .trim();

    let groupName = "Option";
    let optionValue = rawName;

    if (rawName.includes(":")) {
      const parts = rawName.split(":");
      groupName = parts[0].trim() || "Option";
      optionValue = parts.slice(1).join(":").trim() || rawName;
    }

    if (!grouped[groupName]) {
      grouped[groupName] = [];
    }

    grouped[groupName].push({
      ...variant,
      optionValue,
    });
  });

  return grouped;
}

function formatGroupLabel(groupName) {
  const map = {
    color: "Colors",
    colors: "Colors",
    size: "Sizes",
    sizes: "Sizes",
    material: "Materials",
    style: "Styles",
  };
  return map[groupName.toLowerCase()] || groupName;
}

function getCssColor(colorName) {
  const colorMap = {
    red: "#e53e3e",
    blue: "#3182ce",
    green: "#38a169",
    black: "#1a1a1a",
    white: "#f9f9f9",
    gray: "#718096",
    grey: "#718096",
    yellow: "#d69e2e",
    orange: "#dd6b20",
    pink: "#d53f8c",
    purple: "#805ad5",
    brown: "#7b5e3a",
    navy: "#1a365d",
    beige: "#d4a76a",
  };
  return colorMap[colorName.toLowerCase()] || null;
}

function buildVariantsHtml(variants) {
  if (!variants.length) {
    return `<p class="empty-message">${getTranslation("noVariantsAvailable")}</p>`;
  }

  const groupedVariants = groupVariantsByType(variants);
  const groupNames = Object.keys(groupedVariants);

  if (!groupNames.length) {
    return `<p class="empty-message">${getTranslation("noVariantsAvailable")}</p>`;
  }

  return groupNames
    .map((groupName) => {
      const isColorGroup =
        groupName.toLowerCase() === "color" ||
        groupName.toLowerCase() === "colors";

      const optionsHtml = groupedVariants[groupName]
        .map((variant) => {
          const extraPrice =
            variant.priceDelta && Number(variant.priceDelta) !== 0
              ? ` (+${variant.priceDelta})`
              : "";

          const outOfStockClass = variant.inStock ? "" : " out-of-stock";
          const stockLabel = variant.inStock ? "" : ` - ${getTranslation("outOfStock")}`;

          const colorValue = isColorGroup
            ? getCssColor(variant.optionValue)
            : null;
          const swatchHtml = colorValue
            ? `<span class="color-swatch" style="background:${colorValue}"></span>`
            : "";

          return `
            <button
              type="button"
              class="variant-btn${outOfStockClass}${isColorGroup ? " color-btn" : ""}"
              data-group="${escapeHtml(groupName)}"
              data-variant-name="${escapeHtml(variant.name)}"
              data-option-value="${escapeHtml(variant.optionValue)}"
              data-in-stock="${variant.inStock}"
              title="${escapeHtml(variant.optionValue)}"
            >
              ${swatchHtml}${escapeHtml(variant.optionValue)}${escapeHtml(extraPrice)}${escapeHtml(stockLabel)}
            </button>
          `;
        })
        .join("");

      const displayLabel = formatGroupLabel(groupName);

      return `
        <div class="variant-group" data-group-name="${escapeHtml(groupName)}">
          <h4 class="product-section-title">
            ${escapeHtml(displayLabel)}:
            <span class="selected-option-label" id="selected-label-${escapeHtml(groupName)}"></span>
          </h4>
          <div class="variant-list">
            ${optionsHtml}
          </div>
        </div>
      `;
    })
    .join("");
}

function setupThumbnailClicks() {
  const mainImage = document.getElementById("main-product-image");
  const thumbnails = document.querySelectorAll(".thumbnail");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const imageUrl = thumb.dataset.image;
      if (mainImage) mainImage.src = imageUrl;

      thumbnails.forEach((thumbnail) => thumbnail.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}

function setupVariantSelection() {
  selectedOptions = {};

  const variantButtons = document.querySelectorAll(".variant-btn");

  variantButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.inStock === "false") return;

      const groupName = button.dataset.group;
      const optionValue = button.dataset.optionValue;

      const buttonsInSameGroup = Array.from(document.querySelectorAll(".variant-btn")).filter(
        (btn) => btn.dataset.group === groupName,
      );

      if (button.classList.contains("selected")) {
        button.classList.remove("selected");
        delete selectedOptions[groupName];

        const label = document.getElementById(`selected-label-${groupName}`);
        if (label) label.textContent = "";
        return;
      }

      buttonsInSameGroup.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");

      selectedOptions[groupName] = optionValue;

      const label = document.getElementById(`selected-label-${groupName}`);
      if (label) label.textContent = optionValue;
    });
  });
}

function getLocalizedCartProductName(product) {
  const englishName = product.nameEn || product.name || getTranslation("productFallbackName");
  const hebrewName = product.nameHe || "";

  if (getCurrentLanguage() === "he" && hebrewName.trim()) {
    return hebrewName;
  }

  return englishName;
}

function setupAddToCart(product) {
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (!addToCartBtn) return;

  addToCartBtn.addEventListener("click", () => {
    const allGroups = Array.from(document.querySelectorAll(".variant-group")).map(
      (element) => element.dataset.groupName,
    );

    const missing = allGroups.filter((group) => !selectedOptions[group]);

    if (missing.length > 0) {
      const missingLabels = missing.map(formatGroupLabel).join(` ${getTranslation("and")} `);
      const message = getTranslation("selectOptionsBeforeAdd").replace("{options}", missingLabels);
      showCartToast(message, "error");

      missing.forEach((group) => {
        const groupElement = Array.from(document.querySelectorAll(".variant-group")).find(
          (element) => element.dataset.groupName === group,
        );

        if (groupElement) {
          groupElement.classList.add("missing-selection");
          setTimeout(() => {
            groupElement.classList.remove("missing-selection");
          }, 2000);
        }
      });

      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const imageUrl = product.mainImageUrl || buildImageList(product)[0] || "";

    const size =
      selectedOptions.Size ||
      selectedOptions.size ||
      selectedOptions.Sizes ||
      selectedOptions.sizes ||
      "";

    const color =
      selectedOptions.Color ||
      selectedOptions.color ||
      selectedOptions.Colors ||
      selectedOptions.colors ||
      "";

    const item = {
      id: product.id,
      name: getLocalizedCartProductName(product),
      nameEn: product.nameEn || product.name || "",
      nameHe: product.nameHe || "",
      price: Number(product.basePrice ?? product.price ?? 0),
      imageUrl,
      size,
      color,
      options: { ...selectedOptions },
      quantity: 1,
    };

    const existingIndex = cart.findIndex((cartItem) => {
      return (
        cartItem.id === item.id &&
        cartItem.size === item.size &&
        cartItem.color === item.color
      );
    });

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showCartToast(getTranslation("productAddedToCart"), "success");
  });
}

function showCartToast(message, type) {
  const existing = document.getElementById("cart-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "cart-toast";
  toast.className = `cart-toast cart-toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("cart-toast--visible");
  });

  setTimeout(() => {
    toast.classList.remove("cart-toast--visible");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.addEventListener("languageChanged", () => {
  updateLanguage();
  if (currentProduct) {
    loadProduct();
  }
});

updateCartCount();
updateLanguage();
initLanguageSelector();
loadProduct();
