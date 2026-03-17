import { useEffect, useState } from "react";

function createCartStore(localStorageKey) {
    const listeners = new Set();

    function loadCart() {
        const stored = localStorage.getItem(localStorageKey);
        return stored ? JSON.parse(stored) : [];
    }

    let cart = loadCart();

    function saveCart() {
        localStorage.setItem(localStorageKey, JSON.stringify(cart));
    }

    function notify() {
        listeners.forEach(l => l(cart));
    }

    return {
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },

        getCart() {
            return cart;
        },

        add(product, quantity = 1) {
            const existing = cart.find(p => p?.id === product?.id);

            if (existing) {
                cart = cart.map(p =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + quantity }
                        : p
                );
            } else {
                cart = [...cart, { ...product, quantity }];
            }

            saveCart();
            notify();
        },

        remove(productId) {
            cart = cart.filter(p => p?.id !== productId);
            saveCart();
            notify();
        },

        clear() {
            cart = [];
            saveCart();
            notify();
        }
    };
}

const stores = new Map();

function getCartStore(key) {
    if (!stores.has(key)) {
        stores.set(key, createCartStore(key));
    }
    return stores.get(key);
}

const useCart = (localStorageKey = "teserakto_cart") => {
    const store = getCartStore(localStorageKey);

    const [cart, setCart] = useState(store.getCart());

    useEffect(() => {
        return store.subscribe(setCart);
    }, [store]);

    return {
        cart,
        addToCart: store.add,
        removeFromCart: store.remove
    };
};

export default useCart;
