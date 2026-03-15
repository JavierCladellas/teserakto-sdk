# Teserakto Shop SDK

The **Teserakto Shop SDK** allows merchants to embed a fully functional **storefront, cart, and checkout** into any website using a simple JavaScript integration.

The SDK fetches products and customization settings from the Teserakto API and renders the UI using React.

---

## Features

- Render a **product storefront**
- Embedded **shopping cart**
- Customizable **checkout flow**
- Remote UI customization
- Responsive layout (desktop / tablet / phone)
- Fast client-side rendering

---

## Installation

### Option 1 — CDN (Recommended for simple websites)

Add the SDK script to your page.

```html
<script src="https://cdn.teserakto.com/sdk/v1/shop-widget.umd.js"></script>
```

Add containers where the shop and cart should render.

```html
<div id="teserakto-shop"></div>
<div id="teserakto-cart"></div>
```

Initialize the SDK.

```html
<script>
TeseraktoShopSDK.init("YOUR_API_KEY", "/checkout");
</script>
```

---

## Checkout Page

On your checkout page include the checkout container and initialize the checkout SDK.

```html
<div id="teserakto-checkout"></div>

<script src="https://cdn.teserakto.com/sdk/v1/shop-widget.umd.js"></script>

<script>
TeseraktoShopSDK.initCheckout("YOUR_API_KEY");
</script>
```

---

## Installation via NPM

If you are using React, Vite, Next.js, or another modern framework, install the SDK via npm.

```bash
npm install teserakto-shop-sdk
```

Then import and initialize it.

```javascript
import { TeseraktoShopSDK } from "teserakto-shop-sdk";

TeseraktoShopSDK.init("YOUR_API_KEY", "/checkout");
```

---

## Required HTML Containers

The SDK renders into specific DOM containers.

### Storefront

```html
<div id="teserakto-shop"></div>
```

### Cart

```html
<div id="teserakto-cart"></div>
```

### Checkout

```html
<div id="teserakto-checkout"></div>
```

---

## API

### `init(apiKey, checkoutUrl)`

Initializes the storefront and cart.

| Parameter | Type | Description |
|-----------|------|-------------|
| apiKey | string | Merchant API key |
| checkoutUrl | string | URL of the checkout page |

Example:

```javascript
TeseraktoShopSDK.init("pk_live_123456", "/checkout");
```

---

### `initCheckout(apiKey)`

Initializes the checkout page.

| Parameter | Type | Description |
|-----------|------|-------------|
| apiKey | string | Merchant API key |

Example:

```javascript
TeseraktoShopSDK.initCheckout("pk_live_123456");
```

---

## How It Works

When initialized, the SDK performs the following steps:

1. Fetches products from the Teserakto API
2. Fetches UI customization settings
3. Normalizes device-specific configuration
4. Renders React components into the provided containers

---

## Example Integration

### Store Page

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Store</title>
</head>
<body>

<nav> 
    <div>My Store Logo</div>
    <div id="teserakto-cart"></div>
</nav>

<div id="teserakto-shop"></div>

<script src="https://cdn.teserakto.com/sdk/v1/shop-widget.umd.js"></script>

<script>
TeseraktoShopSDK.init("pk_live_123456", "/checkout");
</script>

</body>
</html>
```

---

### Checkout Page

```html
<!DOCTYPE html>
<html>
<head>
  <title>Checkout</title>
</head>
<body>

<div id="teserakto-checkout"></div>

<script src="https://cdn.teserakto.com/sdk/v1/shop-widget.umd.js"></script>

<script>
TeseraktoShopSDK.initCheckout("pk_live_123456");
</script>

</body>
</html>
```

---

## Error Handling

If required containers are missing, the SDK will log an error such as:

```
[TeseraktoShopSDK] No container found for shop or cart
```

If API requests fail, the SDK displays a fallback error message in the UI.

---

## Development

Install dependencies:

```bash
npm install
```

Run development mode:

```bash
npm run dev
```

Build the SDK:

```bash
npm run build
```

The built files will appear in:

```
dist/
```

---

## License

MIT License
