import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dish } from './data';

export type PartySize = 1 | 2 | 3 | 4 | 5 | 6;
export type SharingModel = 'sharing' | 'separate' | 'mix';

interface CartItem extends Dish {
  quantity: number;
  notes?: string;
}

interface AppState {
  // Session State
  hasVisited: boolean;
  partySize: PartySize | null;
  sharingModel: SharingModel | null;
  tableNumber: string;
  
  // Cart State
  cart: CartItem[];
  orderStatus: 'draft' | 'pending' | 'confirmed' | 'completed';
  
  // Actions
  setPartySize: (size: PartySize) => void;
  setSharingModel: (model: SharingModel) => void;
  addToCart: (dish: Dish) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  submitOrder: () => void;
  resetSession: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      hasVisited: false,
      partySize: null,
      sharingModel: null,
      tableNumber: '4', // Default for demo
      cart: [],
      orderStatus: 'draft',
      
      setPartySize: (size: PartySize) => set({ partySize: size }),
      setSharingModel: (model: SharingModel) => set({ sharingModel: model, hasVisited: true }),
      
      addToCart: (dish: Dish) => set((state: AppState) => {
        const existingItem = state.cart.find((item: CartItem) => item.id === dish.id);
        if (existingItem) {
          return {
            cart: state.cart.map((item: CartItem) => 
              item.id === dish.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          };
        }
        return { cart: [...state.cart, { ...dish, quantity: 1 }] };
      }),
      
      removeFromCart: (dishId: string) => set((state: AppState) => ({
        cart: state.cart.filter((item: CartItem) => item.id !== dishId)
      })),
      
      updateQuantity: (dishId: string, quantity: number) => set((state: AppState) => {
        if (quantity <= 0) {
          return { cart: state.cart.filter((item: CartItem) => item.id !== dishId) };
        }
        return {
          cart: state.cart.map((item: CartItem) => 
            item.id === dishId ? { ...item, quantity } : item
          )
        };
      }),
      
      submitOrder: () => set({ orderStatus: 'pending' }),
      
      resetSession: () => set({
        hasVisited: false,
        partySize: null,
        sharingModel: null,
        cart: [],
        orderStatus: 'draft'
      })
    }),
    {
      name: 'azay-storage',
    }
  )
);
