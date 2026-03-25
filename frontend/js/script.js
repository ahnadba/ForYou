const API_BASE_URL = "http://localhost:8080/api";

// Navbar actions
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("nav-menu");
const overlay = document.getElementById("overlay");
const navLinks = document.querySelectorAll("#nav-menu a");

function setMobileMenuState(isOpen) {
  if (!navMenu || !overlay) return;

  navMenu.classList.toggle("active", isOpen);
  overlay.classList.toggle("active", isOpen);

  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
}

function closeMobileMenu() {
  setMobileMenuState(false);
  if (typeof closeLanguageMenu === "function") {
    closeLanguageMenu();
  }
}

function toggleMobileMenu() {
  if (!navMenu) return;
  const isOpen = !navMenu.classList.contains("active");
  setMobileMenuState(isOpen);
}

if (menuBtn && navMenu && overlay) {
  // Keep current markup but make the menu trigger keyboard-accessible.
  menuBtn.setAttribute("role", "button");
  menuBtn.setAttribute("tabindex", "0");
  menuBtn.setAttribute("aria-controls", "nav-menu");
  menuBtn.setAttribute("aria-expanded", "false");

  menuBtn.addEventListener("click", toggleMobileMenu);
  menuBtn.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMobileMenu();
    }
  });

  overlay.addEventListener("click", closeMobileMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

const collectionStage = document.getElementById("collectionStage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let latestProducts = [];
let currentIndex = 0;
let autoCollectionTimer = null;

function getProductImage(product) {
  return (
    product.mainImageUrl ||
    product.image ||
    product.thumbnail ||
    "https://via.placeholder.com/500x700?text=Product"
  );
}

function getProductTitle(product) {
  if (typeof getLocalizedText === "function") {
    return getLocalizedText(product, "name", product.title || "Product");
  }
  return product.name || product.title || "Product";
}

function getCategoryName(category) {
  if (typeof getLocalizedText === "function") {
    return getLocalizedText(category, "name", "Category");
  }
  return category.name || "Category";
}

function getProductLink(product) {
  if (product.id !== undefined && product.id !== null) {
    return `./product.html?id=${product.id}`;
  }
  return "#";
}

function getWrappedIndex(index) {
  return (index + latestProducts.length) % latestProducts.length;
}

function getCardRole(index) {
  if (latestProducts.length === 1) return "current";
  if (latestProducts.length === 2) return index === currentIndex ? "current" : "next";
  if (latestProducts.length === 3) {
    if (index === currentIndex) return "current";
    if (index === getWrappedIndex(currentIndex - 1)) return "prev";
    return "next";
  }

  if (index === currentIndex) return "current";
  if (index === getWrappedIndex(currentIndex - 1)) return "prev";
  if (index === getWrappedIndex(currentIndex + 1)) return "next";
  if (index === getWrappedIndex(currentIndex - 2)) return "back-left";
  if (index === getWrappedIndex(currentIndex + 2)) return "back-right";
  return "hidden";
}

function renderCollectionCards() {
  if (!collectionStage) return;

  if (!latestProducts.length) {
    collectionStage.innerHTML = `<div class="collection-empty">${getTranslation("noProducts")}</div>`;
    return;
  }

  collectionStage.innerHTML = "";

  latestProducts.forEach((product, index) => {
    const role = getCardRole(index);
    if (role === "hidden") return;

    const card = document.createElement("a");
    card.className = `collection-card ${role}`;
    card.href = getProductLink(product);

    card.innerHTML = `
      <img src="${getProductImage(product)}" alt="${escapeHtml(getProductTitle(product))}">
      <div class="collection-card-content">
        <div class="collection-card-title">${escapeHtml(getProductTitle(product))}</div>
        <div class="collection-card-price">${formatPrice(product.price)}</div>
      </div>
    `;

    collectionStage.appendChild(card);
  });
}

function showNextProduct() {
  if (!latestProducts.length) return;
  currentIndex = getWrappedIndex(currentIndex + 1);
  renderCollectionCards();
}

function showPrevProduct() {
  if (!latestProducts.length) return;
  currentIndex = getWrappedIndex(currentIndex - 1);
  renderCollectionCards();
}

function stopAutoCollection() {
  if (!autoCollectionTimer) return;
  clearInterval(autoCollectionTimer);
  autoCollectionTimer = null;
}

function startAutoCollection() {
  stopAutoCollection();
  if (!collectionStage || latestProducts.length < 2) return;

  // Auto-swipe every 3 seconds for a more lively showroom effect.
  autoCollectionTimer = setInterval(() => {
    showNextProduct();
  }, 3000);
}

async function loadLatestProducts() {
  if (!collectionStage) return;

  collectionStage.innerHTML = `<div class="collection-loading">${getTranslation("loadingProducts")}</div>`;

  try {
    const response = await fetch(`${API_BASE_URL}/products/new?lang=${getCurrentLanguage()}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      collectionStage.innerHTML = `<div class="collection-empty">${getTranslation("noRecentProducts")}</div>`;
      return;
    }

    latestProducts = data.slice(0, 4);
    currentIndex = 0;
    renderCollectionCards();
    startAutoCollection();
  } catch (error) {
    console.error("Failed to load latest products:", error);
    collectionStage.innerHTML = `<div class="collection-error">${getTranslation("collectionLoadError")}</div>`;
    stopAutoCollection();
  }
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    showPrevProduct();
    startAutoCollection();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    showNextProduct();
    startAutoCollection();
  });
}

if (collectionStage) {
  collectionStage.addEventListener("mouseenter", stopAutoCollection);
  collectionStage.addEventListener("mouseleave", startAutoCollection);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoCollection();
  } else {
    startAutoCollection();
  }
});

const categoriesLink = document.getElementById("categoriesLink");
const categoriesModal = document.getElementById("categoriesModal");
const closeCategoriesModal = document.getElementById("closeCategoriesModal");
const categoriesModalGrid = document.getElementById("categoriesModalGrid");
const homepageCategoriesGrid = document.getElementById("homepageCategoriesGrid");
const mobileCategoriesToggle = document.getElementById("mobileCategoriesToggle");
const mobileSubcategories = document.getElementById("mobileSubcategories");
const languageSwitcher = document.querySelector(".language-switcher");
const navRight = document.querySelector(".nav-right");

let mobileLanguageSlot = null;

let cachedCategories = [];

async function loadCategories() {
  if (!categoriesModalGrid && !mobileSubcategories && !homepageCategoriesGrid) return;

  try {
    const response = await fetch(`${API_BASE_URL}/categories?lang=${getCurrentLanguage()}`);
    if (!response.ok) {
      throw new Error(`Failed to load categories: ${response.status}`);
    }

    const categories = await response.json();
    cachedCategories = Array.isArray(categories) ? categories : [];
    renderHomepageCategories(cachedCategories);
    renderCategoriesModal(cachedCategories);
    renderMobileSubcategories(cachedCategories);
  } catch (error) {
    console.error("Error loading categories:", error);
    if (homepageCategoriesGrid) {
      homepageCategoriesGrid.innerHTML = `<div class="categories-error">${getTranslation("categoriesLoadError")}</div>`;
    }
    if (categoriesModalGrid) {
      categoriesModalGrid.innerHTML = `<div class="categories-error">${getTranslation("categoriesLoadError")}</div>`;
    }
    if (mobileSubcategories) {
      mobileSubcategories.innerHTML = `<li><a href="#">${getTranslation("categoriesLoadError")}</a></li>`;
    }
  }
}

function getCategoryImage(category) {
  return (
    category.imageUrl ||
    "https://via.placeholder.com/900x1100?text=Category"
  );
}

function renderHomepageCategories(categories) {
  if (!homepageCategoriesGrid) return;

  if (!categories.length) {
    homepageCategoriesGrid.innerHTML = `<div class="categories-empty">${getTranslation("noCategories")}</div>`;
    return;
  }

  homepageCategoriesGrid.innerHTML = categories
    .map(
      (category) => `
        <a href="category.html?id=${category.id}" class="category-card">
          <img src="${escapeHtml(getCategoryImage(category))}" alt="${escapeHtml(getCategoryName(category))}" />
          <div class="category-overlay">
            <h3>${escapeHtml(getCategoryName(category))}</h3>
          </div>
        </a>
      `,
    )
    .join("");
}

function renderCategoriesModal(categories) {
  if (!categoriesModalGrid) return;
  if (!categories.length) {
    categoriesModalGrid.innerHTML = `<div class="categories-empty">${getTranslation("noCategories")}</div>`;
    return;
  }

  categoriesModalGrid.innerHTML = categories
    .map(
      (category) => `
    <a class="category-modal-card" href="category.html?id=${category.id}">
      <img class="category-modal-thumb" src="${escapeHtml(getCategoryImage(category))}" alt="${escapeHtml(getCategoryName(category))}">
      <div class="category-modal-copy">
        <h3>${escapeHtml(getCategoryName(category))}</h3>
      </div>
    </a>
  `,
    )
    .join("");
}

function renderMobileSubcategories(categories) {
  if (!mobileSubcategories) return;
  if (!categories.length) {
    mobileSubcategories.innerHTML = `<li><a href="#">${getTranslation("noCategories")}</a></li>`;
    return;
  }

  mobileSubcategories.innerHTML = categories
    .map(
      (category) => `
    <li>
      <a href="category.html?id=${category.id}">${escapeHtml(getCategoryName(category))}</a>
    </li>
  `,
    )
    .join("");
}

function openCategoriesModal() {
  if (!categoriesModal) return;
  categoriesModal.classList.add("active");
  document.body.style.overflow = "hidden";
  categoriesModal.setAttribute("aria-hidden", "false");
  if (categoriesLink) {
    categoriesLink.setAttribute("aria-expanded", "true");
  }
}

function closeCategoriesModalFn() {
  if (!categoriesModal) return;
  categoriesModal.classList.remove("active");
  document.body.style.overflow = "";
  categoriesModal.setAttribute("aria-hidden", "true");
  if (categoriesLink) {
    categoriesLink.setAttribute("aria-expanded", "false");
  }
}

if (categoriesLink) {
  categoriesLink.setAttribute("aria-haspopup", "dialog");
  categoriesLink.setAttribute("aria-expanded", "false");
  categoriesLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (window.innerWidth <= 600) return;
    openCategoriesModal();
  });
}

if (closeCategoriesModal) {
  closeCategoriesModal.addEventListener("click", closeCategoriesModalFn);
}

if (categoriesModal) {
  categoriesModal.addEventListener("click", (event) => {
    if (event.target === categoriesModal) closeCategoriesModalFn();
  });
}

if (mobileCategoriesToggle && mobileSubcategories) {
  mobileCategoriesToggle.setAttribute("aria-controls", "mobileSubcategories");
  mobileCategoriesToggle.setAttribute("aria-expanded", "false");
  mobileCategoriesToggle.addEventListener("click", () => {
    const isOpen = !mobileSubcategories.classList.contains("active");
    mobileSubcategories.classList.toggle("active", isOpen);
    mobileCategoriesToggle.classList.toggle("open");
    mobileCategoriesToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCategoriesModalFn();
    closeMobileMenu();
  }
});

function updateAccessibleLabels() {
  if (menuBtn) {
    menuBtn.setAttribute("aria-label", getTranslation("menuLabel"));
  }
  if (mobileCategoriesToggle) {
    mobileCategoriesToggle.setAttribute("aria-label", getTranslation("categoriesToggleLabel"));
  }
  if (closeCategoriesModal) {
    closeCategoriesModal.setAttribute("aria-label", getTranslation("closeCategoriesLabel"));
  }
}

function getOrCreateMobileLanguageSlot() {
  if (!navMenu) return null;
  if (!mobileLanguageSlot) {
    mobileLanguageSlot = document.createElement("li");
    mobileLanguageSlot.className = "nav-item nav-item-language";
    mobileLanguageSlot.setAttribute("id", "mobileLanguageSlot");
  }
  return mobileLanguageSlot;
}

function syncLanguageSwitcherPlacement() {
  if (!languageSwitcher || !navMenu || !navRight) return;

  if (typeof closeLanguageMenu === "function") {
    closeLanguageMenu();
  }

  const isMobile = window.innerWidth <= 600;
  const slot = getOrCreateMobileLanguageSlot();
  if (!slot) return;

  if (isMobile) {
    if (!slot.parentElement) {
      navMenu.appendChild(slot);
    }
    if (languageSwitcher.parentElement !== slot) {
      slot.appendChild(languageSwitcher);
    }
  } else {
    if (languageSwitcher.parentElement !== navRight) {
      const cartLink = navRight.querySelector(".cart");
      if (cartLink) {
        navRight.insertBefore(languageSwitcher, cartLink);
      } else {
        navRight.prepend(languageSwitcher);
      }
    }

    if (slot.parentElement) {
      slot.remove();
    }

    closeMobileMenu();
  }
}

function syncNavbarScrollState() {
  const navbarElement = document.querySelector(".navbar");
  if (!navbarElement) return;
  navbarElement.classList.toggle("scrolled", window.scrollY > 16);
}

document.addEventListener("languageChanged", () => {
  updateAccessibleLabels();
  loadCategories();
  loadLatestProducts();
});

window.addEventListener("scroll", syncNavbarScrollState, { passive: true });
window.addEventListener("resize", syncLanguageSwitcherPlacement);

updateCartCount();
updateLanguage();
initLanguageSelector();
updateAccessibleLabels();
syncNavbarScrollState();
syncLanguageSwitcherPlacement();
if (categoriesModal) {
  categoriesModal.setAttribute("aria-hidden", "true");
}
loadCategories();
loadLatestProducts();
