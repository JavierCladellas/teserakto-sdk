import ReactDOM from "react-dom/client";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import { fetchProducts, fetchCustomization } from "./api.jsx";

import "./index.css";


const normalizeConfig = (config) => {

    return {
        ...config?.config_json?.global_config,
        desktop: {... config?.config_json?.devices?.desktop},
        tablet: {... config?.config_json?.devices?.tablet},
        phone: {... config?.config_json?.devices?.phone},
    };
}
let overrides = {
    global: null,
    shop: null,
    activeDevice: null
};



let shopRoot = null;
let shopContainerRef = null;

function getShopRoot() {
    const container = document.getElementById("teserakto-shop");
    if (!container) return null;

    // If the container changed, create a new root
    if (shopContainerRef !== container) {
        shopContainerRef = container;
        shopRoot = ReactDOM.createRoot(container);
    }

    return shopRoot;
}


let shopState = {
    products: []
};

let defaultGlobalCustomization = null;
let defaultShopCustomization = null;

async function renderShop() {
    const shopRoot = getShopRoot();
    if (!shopRoot) return;

    const global = overrides.global || defaultGlobalCustomization;
    const shop = overrides.shop || defaultShopCustomization;
    const activeDevice = overrides.activeDevice || null;

    shopRoot.render(
        <Shop
            products={shopState.products}
            globalCustomization={global}
            shopCustomization={shop}
            device={activeDevice}
        />
    );
}


async function initShop(apiKey) {
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

        shopState.products = products;
        defaultGlobalCustomization = normalizeConfig(
            customization.find(c => c.context_type === "global" && c.context_key === "default")
        );

        defaultShopCustomization = normalizeConfig(
            customization.find(c => c.context_type === "storefront" && c.context_key === "default")
        );
        
        renderShop();

    } catch (err) {
        console.error("[TeseraktoShopSDK] Failed to initialize shop", err);
    }
}

function updateShop(globalCustomization, shopCustomization,activeDevice) {
    overrides.global = globalCustomization;
    overrides.shop = shopCustomization;
    overrides.activeDevice = activeDevice;

    if (!shopRoot || shopState.products.length === 0) return;

    renderShop();
}


async function initCart(apiKey, checkoutUrl, customizationOverrides = {}) {
    if (!apiKey) {
        console.error("[TeseraktoShopSDK] No API key provided");
        return;
    }

    const cartContainer = document.getElementById("teserakto-cart");
    try {
        
        if (!cartContainer) {
            console.error("[TeseraktoShopSDK] No container found for cart. Please add <div id='teserakto-cart'></div> to your HTML.");
            return;
        }
        const [customization] = await Promise.all([
            fetchCustomization(apiKey),
        ]);

        const cartRoot = ReactDOM.createRoot(cartContainer);
        const cartCustomization = normalizeConfig(customization.filter(c => c.context_type === 'cart' && c.context_key === "default")?.[0], customizationOverrides);
        cartRoot.render(
            <Cart cartCustomization={cartCustomization} checkoutUrl={checkoutUrl} />
        );
    } catch (err) {
        console.error("[TeseraktoShopSDK] Failed to initialize cart", err);
        cartContainer.innerHTML = `<div style="color:red;padding:20px;">Failed to load cart.</div>`;
    }
}



async function initCheckout(apiKey, customizationOverrides = {}) {
    if (!apiKey) {
        console.error("[TeseraktoShopSDK] No API key provided");
        return;
    }

    const checkoutContainer = document.getElementById("teserakto-checkout");
    try {
        
        if (!checkoutContainer) {
            console.error("[TeseraktoShopSDK] No container found for checkout. Please add <div id='teserakto-checkout'></div> to your HTML.");
            return;
        }
        const [customization] = await Promise.all([
            fetchCustomization(apiKey),
        ]);

        const checkoutRoot = ReactDOM.createRoot(checkoutContainer);
        const checkoutCustomization = normalizeConfig(customization.filter(c => c.context_type === 'checkout' && c.context_key === "default")?.[0], customizationOverrides);
        checkoutRoot.render(
            <Checkout customization={checkoutCustomization} />
        );
    } catch (err) {
        console.error("[TeseraktoShopSDK] Failed to initialize checkout", err);
        checkoutContainer.innerHTML = `<div style="color:red;padding:20px;">Failed to load checkout.</div>`;
    }
}

window.TeseraktoShopSDK = { initShop, updateShop, initCart, initCheckout };

export const TeseraktoShopSDK = { initShop, updateShop, initCart, initCheckout };