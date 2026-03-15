const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch products for a merchant.
 * @param {string} apiKey
 */
export async function fetchProducts(apiKey) {
  const res = await fetch(`${API_URL}/products`, {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
  return res.json();
}



/**
 * Fetch customization/theme for a merchant.
 * @param {string} apiKey
 */
export async function fetchCustomization(apiKey) {
  const res = await fetch(`${API_URL}/storefront/customization`, {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch customization: ${res.statusText}`);
  return res.json();
}
