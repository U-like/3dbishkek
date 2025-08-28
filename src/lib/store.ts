import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, CategoryFilter } from '@/types';

interface AppState {
  // Cart state
  cart: CartItem[];
  cartTotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Favorites state
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;



  // UI state
  selectedCategory: CategoryFilter;
  setSelectedCategory: (category: CategoryFilter) => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isFavoritesOpen: boolean;
  setFavoritesOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      get cartTotal() {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cart: [...cart, { ...product, quantity: 1 }],
          });
        }
      },
      removeFromCart: (productId) => {
        const { cart } = get();
        const newCart = cart.filter((item) => item.id !== productId);
        set({ cart: newCart });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const { cart } = get();
        const newCart = cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ cart: newCart });
      },
      clearCart: () => set({ cart: [] }),

      // Favorites state
      favorites: [],
      addToFavorites: (product) => {
        const { favorites } = get();
        if (!favorites.find((item) => item.id === product.id)) {
          set({ favorites: [...favorites, product] });
        }
      },
      removeFromFavorites: (productId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((item) => item.id !== productId) });
      },



      // UI state
      selectedCategory: 'all',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isFavoritesOpen: false,
      setFavoritesOpen: (open) => set({ isFavoritesOpen: open }),
    }),
    {
      name: 'marketplace-storage',
      partialize: (state) => ({
        cart: state.cart,
        cartTotal: state.cartTotal,
        favorites: state.favorites,
      }),
    }
  )
);