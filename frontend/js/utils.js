// Utility functions shared across the application

/**
 * Updates the cart count display in the navbar
 * Reads cart data from localStorage and calculates total items
 */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;
  const totalItems = cart.reduce((sum, item) => {
    return sum + Number(item.quantity || 0);
  }, 0);
  cartCount.textContent = totalItems;
}

/**
 * Escapes HTML characters to prevent XSS in user-generated content
 * @param {string} text - The text to escape
 * @returns {string} - The escaped HTML string
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Formats a price value with currency symbol
 * @param {number|string} price - The price to format
 * @returns {string} - Formatted price string with ₪ symbol
 */
function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "Price unavailable";
  }
  return `${Number(price).toFixed(2)} ₪`;
}

/**
 * Sets the current language and updates localStorage
 * @param {string} lang - 'en' or 'he'
 */
function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'he') return;
  localStorage.setItem('currentLanguage', lang);
  updateLanguage();
  document.dispatchEvent(new CustomEvent('languageChanged', {
    detail: { language: lang }
  }));
  // Reload dynamic content
  if (typeof loadCategories === 'function') loadCategories();
  if (typeof loadLatestProducts === 'function') loadLatestProducts();
  if (typeof loadProducts === 'function') loadProducts();
  if (typeof loadCategoryPage === 'function') loadCategoryPage();
}

/**
 * Gets the current language from localStorage, defaults to 'en'
 * @returns {string} - 'en' or 'he'
 */
function getCurrentLanguage() {
  return localStorage.getItem('currentLanguage') || 'en';
}

/**
 * Updates the page language by setting dir attribute and translating elements
 */
function updateLanguage() {
  const lang = getCurrentLanguage();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  document.body.classList.toggle('rtl', lang === 'he');
  // Translate elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = getTranslation(key);
  });

  const languageSelectElement = document.getElementById('languageSelect');
  if (languageSelectElement) {
    languageSelectElement.setAttribute('aria-label', getTranslation('languageLabel'));
  }
}

/**
 * Gets translation for a key based on current language
 * @param {string} key - Translation key
 * @returns {string} - Translated text
 */
function getTranslation(key) {
  const lang = getCurrentLanguage();
  return translations[lang][key] || key;
}

/**
 * Initializes the shared language select element in the navbar.
 * Avoids duplicate const declarations across page-level scripts.
 */
function initLanguageSelector() {
  const languageSelectElement = document.getElementById('languageSelect');
  if (!languageSelectElement) return;
  languageSelectElement.value = getCurrentLanguage();
  languageSelectElement.setAttribute('aria-label', getTranslation('languageLabel'));
}

/**
 * Resolves multilingual text from API objects with safe fallbacks.
 * Hebrew: he field -> en field -> default
 * English: en field -> default
 */
function getLocalizedText(item, baseField, fallback = '') {
  if (!item || !baseField) return fallback;

  const language = getCurrentLanguage();
  const enField = `${baseField}En`;
  const heField = `${baseField}He`;

  if (language === 'he') {
    const heValue = item[heField];
    if (typeof heValue === 'string' && heValue.trim()) return heValue;
  }

  const enValue = item[enField];
  if (typeof enValue === 'string' && enValue.trim()) return enValue;

  const defaultValue = item[baseField];
  if (typeof defaultValue === 'string' && defaultValue.trim()) return defaultValue;

  return fallback;
}

