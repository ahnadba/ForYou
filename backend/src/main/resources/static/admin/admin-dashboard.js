document.addEventListener("DOMContentLoaded", async () => {
  const ok = await requireAdminAuth();
  if (!ok) return;

  markActiveAdminNav();
  wireAdminLogout();

  const productsCount = document.getElementById("metricProducts");
  const categoriesCount = document.getElementById("metricCategories");
  const activeProductsCount = document.getElementById("metricActiveProducts");

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      adminFetch("/api/admin/products"),
      adminFetch("/api/admin/categories"),
    ]);

    const [products, categories] = await Promise.all([
      productsRes.json(),
      categoriesRes.json(),
    ]);

    productsCount.textContent = products.length;
    categoriesCount.textContent = categories.length;
    activeProductsCount.textContent = products.filter((product) => product.active).length;
  } catch (error) {
    productsCount.textContent = "-";
    categoriesCount.textContent = "-";
    activeProductsCount.textContent = "-";
  }
});


