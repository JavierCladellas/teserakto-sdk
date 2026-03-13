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


  function renderProductCard(product) {
    const image = product.image_url || product.variants?.[0]?.image_url 
    return `
      <div class="shop-card">
        <img src="${API_URL}/${image}" class="shop-image">

        <h3>${product.name}</h3>

        <p>${product.description || ""}</p>

        <strong>$${product.price || 0}</strong>
      </div>
    `
  }


    async function render(options) {
        const container = document.querySelector("#teserakto-shop")

        if (!container) {
        console.error("ShopSDK: container not found")
        return
        }

        const products = await fetchProducts(options.apiKey)
        container.innerHTML = products
        .map(product => renderProductCard(product))
        .join("")
    }

    window.ShopSDK = { render }

    // auto-init if script has data-key and container
    const currentScript = document.currentScript
    if (currentScript?.dataset?.key) {
        const apiKey = currentScript.dataset.key
        render({ element: "#teserakto-shop", apiKey })
    }


})()



