import ReactDOM from "react-dom/client";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart.jsx";
import { fetchProducts, fetchCustomization } from "./api.jsx";

import useCart from "./hooks/useCart";

import "./index.css";


const normalizeConfig = (config) => {
    return {
        ...config.config_json.global_config,
        desktop: {... config.config_json.devices.desktop},
        tablet: {... config.config_json.devices.tablet},
        phone: {... config.config_json.devices.phone},
    };
}


/**
 * Initializes and renders the shop
 * @param {string} apiKey - Merchant's API key
 */
async function init(apiKey) {
    if (!apiKey) {
        console.error("[TeseraktoShopSDK] No API key provided");
        return;
    }

    
    try {
        const shopContainer = document.getElementById("teserakto-shop");
        const cartContainer = document.getElementById("teserakto-cart");
        
        if ( !shopContainer && !cartContainer) {
            console.error("[TeseraktoShopSDK] No container found for shop or cart. Please add <div id='teserakto-shop'></div> and/or <div id='teserakto-cart'></div> to your HTML.");
            return;
        }
        
        // Fetch products and customization
        const [products, customization] = await Promise.all([
            fetchProducts(apiKey),
            fetchCustomization(apiKey),
        ]);


        // Render shop
        if (shopContainer) {
            const shopRoot = ReactDOM.createRoot(shopContainer);
            const shopCustomization = normalizeConfig(customization.filter(c => c.context_type === 'storefront' && c.context_key === "default")?.[0]);
            shopRoot.render(
                <Shop products={products} customization={shopCustomization}/>
            );
        }

        // Render Cart
        if (cartContainer) {
            const cartCustomization = normalizeConfig(customization.filter(c => c.context_type === 'cart' && c.context_key === "default")?.[0]);
            const cartRoot = ReactDOM.createRoot(cartContainer);
            cartRoot.render(
                <Cart cartCustomization={cartCustomization}/>
            );
        }

    } catch (err) {
        console.error("[TeseraktoShopSDK] Failed to initialize shop", err);
        shopContainer.innerHTML = `<div style="color:red;padding:20px;">Failed to load shop. See console for details.</div>`;
    }
}

window.TeseraktoShopSDK = { init };

export const TeseraktoShopSDK = { init };