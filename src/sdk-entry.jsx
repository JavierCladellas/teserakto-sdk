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
    cart: null,
    checkout: null,
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
let defaultCartCustomization = null;
let defaultCheckoutCustomization = null;

async function renderShop(cartLocalStorageKey) {
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
            cartLocalStorageKey={cartLocalStorageKey}
        />
    );
}


async function initShop(apiKey, cartLocalStorageKey = "teserakto_cart") {
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
        
        renderShop(cartLocalStorageKey);

    } catch (err) {
        console.error("[TeseraktoShopSDK] Failed to initialize shop", err);
    }
}

function updateShop(globalCustomization, shopCustomization,activeDevice,cartLocalStorageKey) {
    overrides.global = globalCustomization;
    overrides.shop = shopCustomization;
    overrides.activeDevice = activeDevice;

    if (!shopRoot || shopState.products.length === 0) return;

    renderShop(cartLocalStorageKey);
}


let cartRoot = null;
let cartContainerRef = null;

function getCartRoot() {
    const container = document.getElementById("teserakto-cart");
    if (!container) return null;

    // If the container changed, create a new root
    if (cartContainerRef !== container) {
        cartContainerRef = container;
        cartRoot = ReactDOM.createRoot(container);
    }

    return cartRoot;
}

async function renderCart(checkoutUrl, localStorageKey) {
    const cartRoot = getCartRoot();
    if (!cartRoot) return;

    const global = overrides.global || defaultGlobalCustomization;
    const cart = overrides.cart || defaultCartCustomization;
    const activeDevice = overrides.activeDevice || null;

    cartRoot.render(
        <Cart
            globalCustomization={global}
            cartCustomization={cart}
            device={activeDevice}
            checkoutUrl={checkoutUrl}
            localStorageKey = {localStorageKey}
        />
    );
}


async function initCart(apiKey, checkoutUrl, cartLocalStorageKey = "teserakto_cart") {
    if (!apiKey) {
        console.error("[TeseraktoShopSDK] No API key provided");
        return;
    }

    try {
        const [customization] = await Promise.all([
            fetchCustomization(apiKey),
        ]);
        defaultGlobalCustomization = normalizeConfig(
            customization.find(c => c.context_type === "global" && c.context_key === "default")
        );

        defaultCartCustomization = normalizeConfig(
            customization.find(c => c.context_type === "cart" && c.context_key === "default")
        );

        renderCart(checkoutUrl,cartLocalStorageKey);

    } catch (err) {
        console.error("[TeseraktoShopSDK] Failed to initialize cart", err);
    }
}
function updateCart(globalCustomization, cartCustomization, activeDevice,checkoutUrl,cartLocalStorageKey = "teserakto_cart") {
    overrides.global = globalCustomization;
    overrides.cart = cartCustomization;
    overrides.activeDevice = activeDevice;

    if (!cartRoot) return;

    renderCart(checkoutUrl,cartLocalStorageKey);
}

let checkoutRoot = null;
let checkoutContainerRef = null;

function getCheckoutRoot() {
    const container = document.getElementById("teserakto-checkout");
    if (!container) return null;

    if (checkoutContainerRef !== container) {
        checkoutContainerRef = container;
        checkoutRoot = ReactDOM.createRoot(container);
    }

    return checkoutRoot;
}

async function renderCheckout(cartLocalStorageKey = "teserakto_cart") {
    const checkoutRoot = getCheckoutRoot();
    if (!checkoutRoot) return;
    
    const global = overrides.global || defaultGlobalCustomization;
    const checkout = overrides.checkout || defaultCheckoutCustomization;
    const activeDevice = overrides.activeDevice || null;
    checkoutRoot.render(
        <Checkout
            globalCustomization={global}
            checkoutCustomization={checkout}
            activeDevice={activeDevice}
            cartLocalStorageKey={cartLocalStorageKey}
        />
    );
}

async function initCheckout(apiKey, cartLocalStorageKey = "teserakto_cart") {
    if (!apiKey) {
        console.error("[TeseraktoShopSDK] No API key provided");
        return;
    }

    try {
        
        const [customization] = await Promise.all([
            fetchCustomization(apiKey),
        ]);
        defaultGlobalCustomization = normalizeConfig(
            customization.find(c => c.context_type === "global" && c.context_key === "default")
        );

        defaultCheckoutCustomization = normalizeConfig(
            customization.find(c => c.context_type === "checkout" && c.context_key === "default")
        );
        
        renderCheckout( cartLocalStorageKey );
        
    } catch (err) {
        console.error("[TeseraktoShopSDK] Failed to initialize checkout", err);
    }
}

function updateCheckout(globalCustomization, checkoutCustomization, activeDevice, cartLocalStorageKey = "teserakto_cart") {
    overrides.global = globalCustomization;
    overrides.checkout = checkoutCustomization;
    overrides.activeDevice = activeDevice;
    
    if (!checkoutRoot) return;

    renderCheckout( cartLocalStorageKey );
}

window.TeseraktoShopSDK = { 
    initShop, updateShop,
    initCart, updateCart,
    initCheckout, updateCheckout
};

export const TeseraktoShopSDK = { 
    initShop, updateShop,
    initCart, updateCart,
    initCheckout, updateCheckout
};