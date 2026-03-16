const cartContent = document.getElementById("cartContent");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getSubtotal(cart) {
  return cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );
}

function getTotalItems(cart) {
  return cart.reduce((sum, item) => sum + Number(item.quantity), 0);
}

function getCartItemName(item) {
  if (getCurrentLanguage() === "he" && item.nameHe && item.nameHe.trim()) {
    return item.nameHe;
  }
  return item.nameEn || item.name || getTranslation("productFallbackName");
}

function updateCartCount() {
  const cart = getCart();
  const cartCountElement = document.getElementById("cartCount");
  if (!cartCountElement) return;
  cartCountElement.textContent = getTotalItems(cart);
}

function updateQuantity(index, change) {
  const cart = getCart();

  if (!cart[index]) return;

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
}

function removeItem(index) {
  const cart = getCart();

  if (!cart[index]) return;

  cart.splice(index, 1);

  saveCart(cart);
  updateCartCount();
  renderCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  renderCart();
}

/**
 * Generates WhatsApp-formatted order message with item details
 * Includes product name, size, color, quantity, and subtotal
 * Message is URL-encoded for WhatsApp API compatibility
 */
function generateWhatsAppMessage(cart) {
  const isHebrew = getCurrentLanguage() === "he";
  let message = isHebrew
    ? "שלום, אני רוצה לבצע את ההזמנה הזו:\n\n"
    : "Hello, I want to place this order:\n\n";

  cart.forEach((item, index) => {
    const size = item.size || item.options?.Size || item.options?.size || "-";
    const color =
      item.color || item.options?.Color || item.options?.color || "-";
    const itemName = getCartItemName(item);

    message += `${index + 1}. ${itemName}\n`;
    message += `${getTranslation("cartSize")}: ${size}\n`;
    message += `${getTranslation("cartColor")}: ${color}\n`;
    message += `${getTranslation("items")}: ${item.quantity}\n`;
    message += `${getTranslation("subtotal")}: ${formatPrice(item.price)}\n\n`;
  });

  message += `${getTranslation("subtotal")}: ${formatPrice(getSubtotal(cart))}`;

  return encodeURIComponent(message);
}

function renderCart() {
  const cart = getCart();

  if (!cartContent) return;

  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <h2>${getTranslation('cartEmpty')}</h2>
        <p>${getTranslation('cartEmptyDesc')}</p>
        <a href="/products.html" class="cart-btn cart-btn-dark">${getTranslation('continueShopping')}</a>
      </div>
    `;
    return;
  }

  const subtotal = getSubtotal(cart);
  const totalItems = getTotalItems(cart);
  // Keep the contact number in one place so it is easy to replace later.
  const whatsappNumber = "05000000000";
  const whatsappMessage = generateWhatsAppMessage(cart);

  cartContent.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${cart
          .map((item, index) => {
            const size =
              item.size || item.options?.Size || item.options?.size || "-";
            const color =
              item.color || item.options?.Color || item.options?.color || "-";
            const imageUrl =
              item.imageUrl ||
              item.image ||
              "https://via.placeholder.com/300x400?text=No+Image";
            const itemName = getCartItemName(item);

            return `
            <div class="cart-item">
              <div class="cart-item-image">
                <img src="${imageUrl}" alt="${itemName}">
              </div>

              <div class="cart-item-details">
                <h3>${itemName}</h3>

                <div class="cart-meta">
                  <span>${getTranslation("cartSize")}: ${size}</span>
                  <span>${getTranslation("cartColor")}: ${color}</span>
                </div>

                <div class="cart-price">${formatPrice(item.price)}</div>

                <div class="cart-actions">
                  <div class="qty-box">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
                    <div class="qty-value">${item.quantity}</div>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                  </div>

                  <button class="remove-btn" onclick="removeItem(${index})">${getTranslation("remove")}</button>
                </div>
              </div>

              <div class="cart-item-total">
                ${formatPrice(Number(item.price) * Number(item.quantity))}
              </div>
            </div>
          `;
          })
          .join("")}
      </div>

      <aside class="cart-summary">
        <h2>${getTranslation('orderSummary')}</h2>

        <div class="summary-row">
          <span>${getTranslation('items')}</span>
          <span>${totalItems}</span>
        </div>

        <div class="summary-row summary-total">
          <span>${getTranslation('subtotal')}</span>
          <span>${formatPrice(subtotal)}</span>
        </div>

        <div class="summary-buttons">
          <a
            class="cart-btn cart-btn-dark"
            href="https://wa.me/${whatsappNumber}?text=${whatsappMessage}"
            target="_blank"
          >
            ${getTranslation('sendOrderWhatsApp')}
          </a>

          <a href="/products.html" class="cart-btn cart-btn-light">${getTranslation('continueShoppingBtn')}</a>

          <button class="cart-btn cart-btn-light" onclick="clearCart()">
            ${getTranslation('clearCart')}
          </button>
        </div>
      </aside>
    </div>
  `;
}

updateCartCount();
updateLanguage();
initLanguageSelector();
renderCart();

// Re-render dynamic cart labels and WhatsApp text when language changes.
document.addEventListener("languageChanged", renderCart);
