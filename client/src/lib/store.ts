import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dish } from './data';

export type PartySize = 1 | 2 | 3 | 4 | 5 | 6;
export type SharingModel = 'sharing' | 'separate' | 'mix';

export type ServiceRequestType = 'refill' | 'cutlery' | 'condiment' | 'side' | 'custom' | 'bill';
export type ServiceRequestStatus = 'pending' | 'acknowledged' | 'completed';

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'hidden';

export interface Table {
  id: string;
  name: string;
  seats: number;
  x: number;
  y: number;
  floor: number;
  status: TableStatus;
  seatedTime?: number; // Timestamp when table became occupied
  mergedIds?: string[]; // IDs of tables merged into this one
  originalName?: string; // Original name before merge
  originalSeats?: number; // Original seats before merge
}

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
  orders: (CartItem & { served?: boolean })[];
  
  orderStatus: 'draft' | 'pending' | 'confirmed' | 'completed';
  
  // Service Requests State
  serviceRequests: ServiceRequest[];

  // Table State
  tables: Table[];
  floors: { id: number; name: string }[];
  
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
  
  // Order Actions
  toggleOrderServed: (orderId: string, variationId?: string) => void;

  // Table Actions
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  joinTables: (sourceTableId: string, targetTableId: string) => void;
  splitTable: (tableId: string) => void;
  resetTables: () => void;
  simulateRequest: () => void;
  
  // Floor Actions
  addFloor: () => void;
  updateFloorName: (id: number, name: string) => void;
  
  // Table Management Actions
  addTable: (table: Table) => void;
  updateTable: (table: Table) => void;
  deleteTable: (tableId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      hasVisited: false,
      partySize: null,
      sharingModel: null,
      tableNumber: '12', // Default for demo
      cart: [],
      orders: [
        { id: '1', name: 'Steak Frites', price: 32, quantity: 1, selectedVariationId: 'medium-rare', selectedVariationName: 'Medium Rare', served: false, description: 'Prime ribeye, herb butter, fries', category: 'mains', image: '/images/steak.jpg', tags: ['Meat'] },
        { id: '2', name: 'Truffle Pasta', price: 28, quantity: 1, served: true, description: 'Fresh tagliatelle, black truffle, parmesan', category: 'mains', image: '/images/pasta.jpg', tags: ['Vegetarian'] },
        { id: '3', name: 'Burrata', price: 18, quantity: 1, served: true, description: 'Heirloom tomatoes, basil pesto, balsamic', category: 'starters', image: '/images/burrata.jpg', tags: ['Vegetarian'] },
        { id: '4', name: 'Red Wine', price: 14, quantity: 2, served: true, description: 'Cabernet Sauvignon, Napa Valley', category: 'drinks', image: '/images/wine.jpg', tags: ['Alcohol'] }
      ],
      orderStatus: 'pending',
      serviceRequests: [],
      floors: [
        { id: 1, name: '1st Floor' }
      ],
      tables: [
        // 1st Floor
        { id: '1', name: 'T1', seats: 2, x: 100, y: 100, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 45 },
        { id: '2', name: 'T2', seats: 2, x: 100, y: 250, floor: 1, status: 'available' },
        { id: '3', name: 'T3', seats: 4, x: 300, y: 100, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 15 },
        { id: '4', name: 'T4', seats: 4, x: 300, y: 250, floor: 1, status: 'reserved' },
        { id: '5', name: 'T5', seats: 6, x: 550, y: 180, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 90 },
        { id: '6', name: 'T6', seats: 2, x: 800, y: 100, floor: 1, status: 'available' },
        { id: '7', name: 'T7', seats: 4, x: 800, y: 250, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 30 },
        { id: '8', name: 'T8', seats: 8, x: 550, y: 400, floor: 1, status: 'reserved' },
        { id: '12', name: 'T12', seats: 4, x: 300, y: 400, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 5 },
        // Bar Stools (1st Floor)
        { id: 'b1', name: 'B1', seats: 1, x: 1100, y: 100, floor: 1, status: 'available' },
        { id: 'b2', name: 'B2', seats: 1, x: 1100, y: 160, floor: 1, status: 'available' },
        { id: 'b3', name: 'B3', seats: 1, x: 1100, y: 220, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 20 },
        { id: 'b4', name: 'B4', seats: 1, x: 1100, y: 280, floor: 1, status: 'available' },
        { id: 'b5', name: 'B5', seats: 1, x: 1100, y: 340, floor: 1, status: 'available' },
        { id: 'b6', name: 'B6', seats: 1, x: 1100, y: 400, floor: 1, status: 'available' },
        { id: 'b7', name: 'B7', seats: 1, x: 1100, y: 460, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 10 },
        { id: 'b8', name: 'B8', seats: 1, x: 1100, y: 520, floor: 1, status: 'available' },
        { id: 'b9', name: 'B9', seats: 1, x: 1100, y: 580, floor: 1, status: 'available' },
        { id: 'b10', name: 'B10', seats: 1, x: 1100, y: 640, floor: 1, status: 'available' },

      ],
      
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
      })),

      toggleOrderServed: (orderId: string, variationId?: string) => set((state: AppState) => ({
        orders: state.orders.map(order => 
          (order.id === orderId && order.selectedVariationId === variationId)
            ? { ...order, served: !order.served }
            : order
        )
      })),

      updateTableStatus: (tableId: string, status: TableStatus) => set((state: AppState) => ({
        tables: state.tables.map(table => 
          table.id === tableId 
            ? { 
                ...table, 
                status, 
                seatedTime: status === 'occupied' ? Date.now() : (status === 'available' ? undefined : table.seatedTime)
              } 
            : table
        )
      })),

      joinTables: (sourceTableId: string, targetTableId: string) => set((state: AppState) => {
        const sourceTable = state.tables.find(t => t.id === sourceTableId);
        const targetTable = state.tables.find(t => t.id === targetTableId);
        
        if (!sourceTable || !targetTable) return {};
        if (sourceTableId === targetTableId) return {};

        // Check if source is already part of target's mergedIds to prevent duplicates
        if (targetTable.mergedIds?.includes(sourceTableId)) return {};

        return {
          tables: state.tables.map(table => {
            if (table.id === targetTableId) {
              const mergedIds = [...(table.mergedIds || []), sourceTableId, ...(sourceTable.mergedIds || [])];
              // Deduplicate mergedIds
              const uniqueMergedIds = Array.from(new Set(mergedIds));
              
              return { 
                ...table, 
                name: `${table.name}+${sourceTable.name}`, 
                seats: table.seats + sourceTable.seats,
                mergedIds: uniqueMergedIds,
                originalName: table.originalName || table.name,
                originalSeats: table.originalSeats || table.seats
              };
            }
            if (table.id === sourceTableId) {
              return { ...table, status: 'hidden' }; 
            }
            return table;
          })
        };
      }),

      splitTable: (tableId: string) => set((state: AppState) => {
        const targetTable = state.tables.find(t => t.id === tableId);
        if (!targetTable || !targetTable.mergedIds || targetTable.mergedIds.length === 0) return {};

        const idsToRestore = targetTable.mergedIds;

        return {
          tables: state.tables.map(table => {
            // Restore the target table to original state
            if (table.id === tableId) {
              return {
                ...table,
                name: table.originalName || table.name,
                seats: table.originalSeats || table.seats,
                mergedIds: [],
                originalName: undefined,
                originalSeats: undefined
              };
            }
            // Unhide all tables that were merged into this one AND recursively reset them
            // This ensures that if T2 was merged into T1, and T3 was merged into T2, splitting T1 restores T2 and T3 fully.
            // Actually, our current join logic flattens everything into the target table's mergedIds list.
            // So we just need to make sure we reset any potential "merged" state on the restored tables too, just in case.
            if (idsToRestore.includes(table.id)) {
              return { 
                ...table, 
                status: 'available',
                // Reset these just in case they had leftover state, though they shouldn't if hidden
                mergedIds: [],
                originalName: undefined,
                originalSeats: undefined,
                // If we want to restore their original name if they were renamed before hiding (unlikely in current logic but safe)
                name: table.originalName || table.name,
                seats: table.originalSeats || table.seats
              };
            }
            return table;
          })
        };
      }),

      addFloor: () => set((state: AppState) => {
        const newId = Math.max(...state.floors.map(f => f.id), 0) + 1;
        return {
          floors: [...state.floors, { id: newId, name: `${newId}${newId === 2 ? 'nd' : newId === 3 ? 'rd' : 'th'} Floor` }]
        };
      }),

      updateFloorName: (id: number, name: string) => set((state: AppState) => ({
        floors: state.floors.map(f => f.id === id ? { ...f, name } : f)
      })),

      addTable: (table: Table) => set((state: AppState) => ({
        tables: [...state.tables, table]
      })),

      updateTable: (updatedTable: Table) => set((state: AppState) => ({
        tables: state.tables.map(t => t.id === updatedTable.id ? updatedTable : t)
      })),

      deleteTable: (tableId: string) => set((state: AppState) => ({
        tables: state.tables.filter(t => t.id !== tableId)
      })),

      simulateRequest: () => set((state: AppState) => {
        const requestTypes = ['refill', 'cutlery', 'condiment', 'side', 'custom', 'bill'] as const;
        const randomType = requestTypes[Math.floor(Math.random() * requestTypes.length)];
        
        // Filter for visible tables only
        const visibleTables = state.tables.filter(t => t.status !== 'hidden');
        if (visibleTables.length === 0) return {};
        
        const randomTable = visibleTables[Math.floor(Math.random() * visibleTables.length)];
        // Extract table number from name (e.g., "T12" -> "12", "B1" -> "1")
        // If merged (e.g. "T1+T2"), just pick the first part or use the name as is if logic supports it
        // The dashboard expects tableNumber to match the name without prefix for T/B usually, 
        // but let's just use the name directly if it's complex, or strip T/B if simple.
        let tableNum = randomTable.name;
        if (tableNum.startsWith('T') || tableNum.startsWith('B')) {
           // Only strip if it's a simple T12 or B1, not T1+T2
           if (!tableNum.includes('+')) {
             tableNum = tableNum.substring(1);
           }
        }

        return {
          serviceRequests: [
            {
              id: Math.random().toString(36).substring(2, 9),
              type: randomType,
              details: randomType === 'custom' ? 'Customer needs assistance' : '',
              status: 'pending',
              timestamp: Date.now(),
              tableNumber: tableNum
            },
            ...state.serviceRequests
          ]
        };
      }),

      resetTables: () => set((state: AppState) => ({
        tables: [
          { id: '1', name: 'T1', seats: 2, x: 100, y: 100, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 45 },
          { id: '2', name: 'T2', seats: 2, x: 100, y: 250, floor: 1, status: 'available' },
          { id: '3', name: 'T3', seats: 4, x: 300, y: 100, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 15 },
          { id: '4', name: 'T4', seats: 4, x: 300, y: 250, floor: 1, status: 'reserved' },
          { id: '5', name: 'T5', seats: 6, x: 550, y: 180, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 90 },
          { id: '6', name: 'T6', seats: 2, x: 800, y: 100, floor: 1, status: 'available' },
          { id: '7', name: 'T7', seats: 4, x: 800, y: 250, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 30 },
          { id: '8', name: 'T8', seats: 8, x: 550, y: 400, floor: 1, status: 'reserved' },
          { id: '12', name: 'T12', seats: 4, x: 300, y: 400, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 5 },
          // Bar Stools
          { id: 'b1', name: 'B1', seats: 1, x: 1100, y: 100, floor: 1, status: 'available' },
          { id: 'b2', name: 'B2', seats: 1, x: 1100, y: 160, floor: 1, status: 'available' },
          { id: 'b3', name: 'B3', seats: 1, x: 1100, y: 220, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 20 },
          { id: 'b4', name: 'B4', seats: 1, x: 1100, y: 280, floor: 1, status: 'available' },
          { id: 'b5', name: 'B5', seats: 1, x: 1100, y: 340, floor: 1, status: 'available' },
          { id: 'b6', name: 'B6', seats: 1, x: 1100, y: 400, floor: 1, status: 'available' },
          { id: 'b7', name: 'B7', seats: 1, x: 1100, y: 460, floor: 1, status: 'occupied', seatedTime: Date.now() - 1000 * 60 * 10 },
          { id: 'b8', name: 'B8', seats: 1, x: 1100, y: 520, floor: 1, status: 'available' },
          { id: 'b9', name: 'B9', seats: 1, x: 1100, y: 580, floor: 1, status: 'available' },
          { id: 'b10', name: 'B10', seats: 1, x: 1100, y: 640, floor: 1, status: 'available' },
        ],
        serviceRequests: [],
        orders: [
          { id: '1', name: 'Steak Frites', price: 32, quantity: 1, selectedVariationId: 'medium-rare', selectedVariationName: 'Medium Rare', served: false, description: 'Prime ribeye, herb butter, fries', category: 'mains', image: '/images/steak.jpg', tags: ['Meat'] },
          { id: '2', name: 'Truffle Pasta', price: 28, quantity: 1, served: true, description: 'Fresh tagliatelle, black truffle, parmesan', category: 'mains', image: '/images/pasta.jpg', tags: ['Vegetarian'] },
          { id: '3', name: 'Burrata', price: 18, quantity: 1, served: true, description: 'Heirloom tomatoes, basil pesto, balsamic', category: 'starters', image: '/images/burrata.jpg', tags: ['Vegetarian'] },
          { id: '4', name: 'Red Wine', price: 14, quantity: 2, served: true, description: 'Cabernet Sauvignon, Napa Valley', category: 'drinks', image: '/images/wine.jpg', tags: ['Alcohol'] }
        ],
        orderStatus: 'pending'
      }))
    }),
    {
      name: 'azay-storage-v2', // Changed key to force reset
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration to add floors if missing
          return {
            ...persistedState,
            floors: persistedState.floors || [{ id: 1, name: '1st Floor' }],
            tables: persistedState.tables || []
          };
        }
        return persistedState;
      },
      version: 1, // Bumped version
    }
  )
);
