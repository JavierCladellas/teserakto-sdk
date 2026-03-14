import ReactDOM from "react-dom/client";
import Shop from "./components/Shop";
import { fetchProducts, fetchCustomization } from "./api.jsx";
import "./index.css";

/**
 * Initializes and renders the shop
 * @param {string} containerId - ID of the element to render the shop into
 * @param {string} apiKey - Merchant's API key
 */
async function initShop(containerId, apiKey) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`[TeseraktoShopSDK] Container with id "${containerId}" not found`);
        return;
    }
    if (!apiKey) {
        console.error("[TeseraktoShopSDK] No API key provided");
        return;
    }

    try {
        // Fetch products and customization
        const [products, customization] = await Promise.all([
            fetchProducts(apiKey),
            fetchCustomization(apiKey),
        ]);


        // Render React component
        const root = ReactDOM.createRoot(container);
        root.render(
            <Shop
            products={products}
            customization={customization}
            reserveHeaderSpace={true}
            />
        );
    } catch (err) {
        console.error("[TeseraktoShopSDK] Failed to initialize shop", err);
        container.innerHTML = `<div style="color:red;padding:20px;">Failed to load shop. See console for details.</div>`;
    }
}

window.TeseraktoShopSDK = { initShop };

export const TeseraktoShopSDK = { initShop };