"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Product } from "../../types";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // I use localstorage here so the cart doesnt disappear when the page is refreshed
  useEffect(() => {
    const savedCart = localStorage.getItem("shopping-cart");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        setCartItems(parsedCart);
      } catch {
        localStorage.removeItem("shopping-cart");
      }
    }

    setIsLoaded(true);
  }, []);

  // Save cart when something changes
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("shopping-cart", JSON.stringify(cartItems));
  }, [cartItems, isLoaded]);

  function addToCart(product: Product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock ?? Infinity
                ),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(productId: number) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  function increaseQuantity(productId: number) {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const maxQuantity = item.stock ?? Infinity;

        return {
          ...item,
          quantity: Math.min(item.quantity + 1, maxQuantity),
        };
      })
    );
  }

  function decreaseQuantity(productId: number) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}