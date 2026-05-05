import { create } from 'zustand';

const useStore = create((set) => ({
  // Cart State
  cart: [],
  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== productId)
  })),

  // Wishlist State
  wishlist: [],
  toggleWishlist: (product) => set((state) => {
    const isLiked = state.wishlist.some(item => item.id === product.id);
    if (isLiked) {
      return { wishlist: state.wishlist.filter((item) => item.id !== product.id) };
    }
    return { wishlist: [...state.wishlist, product] };
  }),

  // Auth State
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useStore;
