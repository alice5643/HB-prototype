import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dish } from './data';

export type PartySize = 1 | 2 | 3 | 4 | 5 | 6;
export type SharingModel = 'sharing' | 'separate' | 'mix';

export type ServiceRequestType = 'refill' | 'cutlery' | 'condiment' | 'side' | 'custom' | 'bill';
export type ServiceRequestStatus = 'pending' | 'acknowledged' | 'completed';

export interface ServiceRequest {
  id: string;
  type: ServiceRequestType;
  details: string;
  status: ServiceRequestStatus;
  timestamp: number;
  tableNumber: string;
}

interface CartItem extends Dish {
  quantity: number;
  notes?: string;
  selectedVariationId?: string;
  selectedVariationName?: string;
}

interface AppState {
  // Session State
  hasVisited: boolean;
  partySize: PartySize | null;
  sharingModel: SharingModel | null;
  tableNumber: string;
  
  // Cart State (Pending items)
  cart: CartItem[];
  
  // Orders State (Submitted items)
  orders: CartItem[];
  
  orderStatus: 'draft' | 'pending' | 'confirmed' | 'completed';
  
  // Service Requests State
  serviceRequests: ServiceRequest[];
  
  // Actions
  setPartySize: (size: PartySize) => void;
  setSharingModel: (model: SharingModel) => void;
  addToCart: (dish: Dish, variationId?: string, variationName?: string, variationPrice?: number) => void;
  removeFromCart: (dishId: string, variationId?: string) => void;
  updateQuantity: (dishId: string, quantity: number, variationId?: string) => void;
  submitOrder: () => void;
  resetSession: () => void;
  
  // Service Request Actions
  addServiceRequest: (type: ServiceRequestType, details: string) => void;
  updateServiceRequestStatus: (id: string, status: ServiceRequestStatus) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      hasVisited: false,
      partySize: null,
      sharingModel: null,
      tableNumber: '4', // Default for demo
      cart: [],
      orders: [],
      orderStatus: 'draft',
      serviceRequests: [],
      
      setPartySize: (size: PartySize) => set({ partySize: size }),
      setSharingModel: (model: SharingModel) => set({ sharingModel: model, hasVisited: true }),
      
      addToCart: (dish: Dish, variationId?: string, variationName?: string, variationPrice?: number) => set((state: AppState) => {
        const existingItem = state.cart.find((item: CartItem) => 
          item.id === dish.id && item.selectedVariationId === variationId
        );
        
        if (existingItem) {
          return {
            cart: state.cart.map((item: CartItem) => 
              (item.id === dish.id && item.selectedVariationId === variationId)
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          };
        }
        
        const newItem = { 
          ...dish, 
          quantity: 1,
          selectedVariationId: variationId,
          selectedVariationName: variationName,
          price: variationPrice || dish.price
        };
        
        return { cart: [...state.cart, newItem] };
      }),
      
      removeFromCart: (dishId: string, variationId?: string) => set((state: AppState) => ({
        cart: state.cart.filter((item: CartItem) => 
          !(item.id === dishId && item.selectedVariationId === variationId)
        )
      })),
      
      updateQuantity: (dishId: string, quantity: number, variationId?: string) => set((state: AppState) => {
        if (quantity <= 0) {
          return { 
            cart: state.cart.filter((item: CartItem) => 
              !(item.id === dishId && item.selectedVariationId === variationId)
            ) 
          };
        }
        return {
          cart: state.cart.map((item: CartItem) => 
            (item.id === dishId && item.selectedVariationId === variationId)
              ? { ...item, quantity } 
              : item
          )
        };
      }),
      
      submitOrder: () => set((state: AppState) => {
        const newOrders = [...state.orders];
        
        state.cart.forEach(cartItem => {
          const existingOrderIndex = newOrders.findIndex(orderItem => 
            orderItem.id === cartItem.id && orderItem.selectedVariationId === cartItem.selectedVariationId
          );
          
          if (existingOrderIndex >= 0) {
            newOrders[existingOrderIndex] = {
              ...newOrders[existingOrderIndex],
              quantity: newOrders[existingOrderIndex].quantity + cartItem.quantity
            };
          } else {
            newOrders.push(cartItem);
          }
        });
        
        return {
          orders: newOrders,
          cart: [], // Clear cart
          orderStatus: 'pending'
        };
      }),
      
      resetSession: () => set({
        hasVisited: false,
        partySize: null,
        sharingModel: null,
        cart: [],
        orders: [],
        orderStatus: 'draft',
        serviceRequests: []
      }),
      
      addServiceRequest: (type: ServiceRequestType, details: string) => set((state: AppState) => ({
        serviceRequests: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type,
            details,
            status: 'pending',
            timestamp: Date.now(),
            tableNumber: state.tableNumber
          },
          ...state.serviceRequests
        ]
      })),
      
      updateServiceRequestStatus: (id: string, status: ServiceRequestStatus) => set((state: AppState) => ({
        serviceRequests: state.serviceRequests.map(req => 
          req.id === id ? { ...req, status } : req
        )
      }))
    }),
    {
      name: 'azay-storage',
    }
  )
);
