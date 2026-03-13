(function () {

    const API_URL = "http://127.0.0.1:8000/api"

    async function fetchProducts(apiKey) {
        const response = await fetch(
            `${API_URL}/products`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        )
        return response.json()
    }


    async function fetchUiConfigs(apiKey) {
        const response = await fetch(
            `${API_URL}/storefront/customization/storefront/default`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        )
        return response.json()
    }

    function renderProductCard(product, customization, device) {
        const variant = product.variants?.[0]
        const price = variant?.price || 0
        const inStock = product.has_stock

        const deviceSettings = customization[device] || customization.desktop || {}

        const titleFontSize = deviceSettings.titleFontSize ?? 18
        const descriptionFontSize = deviceSettings.descriptionFontSize ?? 14
        const priceFontSize = deviceSettings.priceFontSize ?? 16
        const buttonFontSize = deviceSettings.buttonFontSize ?? 14

        const image = product.image_url || variant?.image_url

        return `
            <div class="shop-card" style="
                background:${customization.cardBgColor};
                font-family:${customization.fontFamily};
                border-radius:10px;
                box-shadow:0 4px 8px rgba(0,0,0,0.1);
                overflow:hidden;
                display:flex;
                flex-direction:column;
            ">

                <div style="height:180px;overflow:hidden;background:#f3f3f3;">
                ${
                    image
                    ? `<img src="${API_URL}/${image}" style="width:100%;height:100%;object-fit:cover"/>`
                    : `<div style="display:flex;align-items:center;justify-content:center;height:100%">No Image</div>`
                }
                </div>

                <div style="padding:16px;display:flex;flex-direction:column;gap:10px;flex:1">

                <h3 style="
                    color:${customization.titleColor};
                    font-size:${titleFontSize}px;
                    margin:0;
                ">
                    ${product.name}
                </h3>

                <p style="
                    color:${customization.textColor};
                    font-size:${descriptionFontSize}px;
                    margin:0;
                ">
                    ${product.description || "No description available"}
                </p>

                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto">

                    <span style="
                    color:${customization.priceColor};
                    font-size:${priceFontSize}px;
                    font-weight:bold;
                    ">
                    $${price.toFixed(2)}
                    </span>

                    <button
                    style="
                        background:${customization.buttonColor};
                        color:${customization.buttonTextColor};
                        border:none;
                        padding:8px 12px;
                        border-radius:6px;
                        font-size:${buttonFontSize}px;
                        cursor:${inStock ? "pointer" : "not-allowed"};
                        opacity:${inStock ? 1 : 0.6};
                    "
                    ${!inStock ? "disabled" : ""}
                    >
                    ${
                        inStock
                        ? customization.addToCartText || "Add to Cart"
                        : customization.outOfStockText || "Out of Stock"
                    }
                    </button>

                </div>
                </div>

            </div>
        `
    }

    function normalizeCustomization(config) {
        return {
            ...config.global_config,
            desktop: config.devices?.desktop || {},
            tablet: config.devices?.tablet || {},
            phone: config.devices?.phone || {},
        }
    }


    function renderGrid(products, customization) {

        const device = getActiveDevice()
        const deviceSettings = customization[device] || customization.desktop

        const columns = deviceSettings?.columns || 1
        const rowsPerPage = deviceSettings?.rowsPerPage || 1

        const itemsPerPage = columns * rowsPerPage
        const pageProducts = products.slice(0, itemsPerPage)
        console.log("Active device:", device, deviceSettings)
        console.log("Columns:", deviceSettings?.columns, "Rows per page:", deviceSettings?.rowsPerPage)

        return `
        <div style="
            display:grid;
            grid-template-columns:repeat(${columns},1fr);
            gap:20px;
        ">
            ${pageProducts.map(p => renderProductCard(p, customization, device)).join("")}
        </div>
        `
    }


    function getActiveDevice() {
        const width = window.innerWidth

        if (width <= 480) return "phone"
        if (width <= 1024) return "tablet"
        return "desktop"
    }

    async function render(options) {

        const container = document.querySelector("#teserakto-shop")

        if (!container) {
            console.error("ShopSDK: container not found")
            return
        }

        const products = await fetchProducts(options.apiKey);
        const uiConfigs = await fetchUiConfigs(options.apiKey);
        const customization = normalizeCustomization(uiConfigs.config_json || {});

        container.innerHTML = renderGrid(products, customization);

    }

    window.ShopSDK = { render }

    const currentScript = document.currentScript
    if (currentScript?.dataset?.key) {
        const apiKey = currentScript.dataset.key
        render({ element: "#teserakto-shop", apiKey })
    }


})()



