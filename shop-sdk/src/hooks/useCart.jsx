import { useEffect, useState } from "react";

const listeners = new Set();

let cart = loadCart();

function loadCart() {
    const stored = localStorage.getItem("teserakto_cart");
    return stored ? JSON.parse(stored) : [];
}

function saveCart() {
    localStorage.setItem("teserakto_cart", JSON.stringify(cart));
}

function notify() {
    listeners.forEach(l => l(cart));
}

const cartStore = {

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
    }
};


const useCart = () => {

    const [cart, setCart] = useState(cartStore.getCart());

    useEffect(() => {
        return cartStore.subscribe(setCart);
    }, []);

    return {
        cart,
        addToCart: cartStore.add,
        removeFromCart: cartStore.remove
    };
}

export default  useCart ;
