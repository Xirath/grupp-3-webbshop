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

// Only this information is stored in localStorage
interface StoredCartItem {
  productId: number;
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

function increaseItemQuantity(item: CartItem): CartItem {
  const maxQuantity = item.stock ?? Infinity;

  return {
    ...item,
    quantity: Math.min(item.quantity + 1, maxQuantity),
  };
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load and validate the cart when the app starts
  useEffect(() => {
    async function loadCart() {
      const savedCart = localStorage.getItem("shopping-cart");

      if (!savedCart) {
        setIsLoaded(true);
        return;
      }

      try {
        const parsedCart = JSON.parse(savedCart) as StoredCartItem[];

        if (!Array.isArray(parsedCart)) {
          throw new Error("Invalid cart data");
        }

        const validatedItems = await Promise.all(
          parsedCart.map(async (storedItem) => {
            if (
              !Number.isInteger(storedItem.productId) ||
              storedItem.productId <= 0 ||
              !Number.isInteger(storedItem.quantity) ||
              storedItem.quantity <= 0
            ) {
              return null;
            }

            try {
              const response = await fetch(
                `http://localhost:4000/products/${storedItem.productId}?_expand=category`,
                { cache: "no-store" },
              );

              // Product no longer exists
              if (!response.ok) {
                return null;
              }

              const product = (await response.json()) as Product;
              const stock = product.stock ?? 0;

              // Product is out of stock
              if (stock <= 0) {
                return null;
              }

              // Never keep more items than are currently in stock
              const quantity = Math.min(storedItem.quantity, stock);

              return {
                ...product,
                quantity,
              } satisfies CartItem;
            } catch {
              return null;
            }
          }),
        );

        const validCartItems = validatedItems.filter(
          (item): item is CartItem => item !== null,
        );

        setCartItems(validCartItems);
      } catch {
        localStorage.removeItem("shopping-cart");
        setCartItems([]);
      } finally {
        setIsLoaded(true);
      }
    }

    void loadCart();
  }, []);

  // Save only product ID and quantity in localStorage
  useEffect(() => {
    if (!isLoaded) return;

    const storedCart: StoredCartItem[] = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    localStorage.setItem("shopping-cart", JSON.stringify(storedCart));
  }, [cartItems, isLoaded]);

  function addToCart(product: Product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? increaseItemQuantity(item) : item,
        );
      }

      const stock = product.stock ?? 0;

      if (stock <= 0) {
        return currentItems;
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
      currentItems.filter((item) => item.id !== productId),
    );
  }

  function increaseQuantity(productId: number) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? increaseItemQuantity(item) : item,
      ),
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
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
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