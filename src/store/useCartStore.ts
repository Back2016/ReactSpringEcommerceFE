import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CardProduct } from '@/lib/types'

interface CartItem extends CardProduct {
  quantity: number
}

interface CartState {
  products: CardProduct[]
  cart: CartItem[]
  addToCart: (product: CardProduct, onSuccess?: (msg: string) => void, onFail?: (msg: string) => void) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number, onSuccess?: (msg: string) => void, onFail?: (msg: string) => void) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      products: [],
      cart: [],
      addToCart: (product, onSuccess, onFail) => {
        const state = get();
        const existingItem = state.cart.find((item) => item.id === product.id);
        const currentQty = existingItem?.quantity || 0;

        if (currentQty + 1 > product.inventory) {
          onFail?.(`Not enough stock. Only ${product.inventory} left in stock`);
          return;
        }

        if (existingItem) {
          set({
            cart: state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          });
          onSuccess?.(`${product.name} quantity updated`);
        } else {
          set({
            cart: [...state.cart, { ...product, quantity: 1 }]
          });
          onSuccess?.(`Product ${product.name} added to cart`);
        }
      },
      updateQuantity: (productId, quantity, onSuccess, onFail) => {
        const state = get();
        const product = state.cart.find((item) => item.id === productId);
        if (!product) return;

        if (quantity > product.inventory) {
          onFail?.(`Not enough stock.Only ${product.inventory} left in stock`);
          return;
        }

        set({
          cart: quantity > 0
            ? state.cart.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            )
            : state.cart.filter((item) => item.id !== productId),
        });

        onSuccess?.(quantity > 0 ? `${product.name} quantity updated` : `Item ${product.name} removed`);
      },
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart-store',
    }
  )
)
