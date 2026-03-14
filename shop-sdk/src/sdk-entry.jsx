import React from "react";
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
        console.error(`[ShopSDK] Container with id "${containerId}" not found`);
        return;
    }
    if (!apiKey) {
        console.error("[ShopSDK] No API key provided");
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
            activeDevice="desktop"
            reserveHeaderSpace={true}
            />
        );
        } catch (err) {
        console.error("[ShopSDK] Failed to initialize shop", err);
        container.innerHTML = `<div style="color:red;padding:20px;">Failed to load shop. See console for details.</div>`;
    }
}

// Auto-init if used via script tag with data-key and data-container
const script = document.currentScript;
if (script) {
    const containerId = script.dataset.container || "teserakto-shop";
    const apiKey = script.dataset.key;
    if (apiKey) {
        initShop(containerId, apiKey);
    }
}

// Expose global object for merchants
window.ShopSDK = { initShop };

export const ShopSDK = { initShop };