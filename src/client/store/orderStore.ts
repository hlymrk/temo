import { create } from 'zustand';

interface OrderItem {
  id: string;
  name: string;
  priceInPence: number;
  quantity: number;
  claimedBy?: string;
}

interface Order {
  _id: string;
  tableId: string;
  restaurantId: string;
  items: OrderItem[];
  totalInPence: number;
  vatInPence: number;
  status: 'active' | 'partial' | 'completed';
}

interface OrderStore {
  order: Order | null;
  setOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  claimItem: (itemId: string, userId: string) => void;
  unclaimItem: (itemId: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: null,
  setOrder: (order) => set({ order }),
  updateOrder: (order) => set({ order }),
  claimItem: (itemId, userId) =>
    set((state) => {
      if (!state.order) return state;
      const items = state.order.items.map((item) =>
        item.id === itemId ? { ...item, claimedBy: userId } : item
      );
      return { order: { ...state.order, items } };
    }),
  unclaimItem: (itemId) =>
    set((state) => {
      if (!state.order) return state;
      const items = state.order.items.map((item) =>
        item.id === itemId ? { ...item, claimedBy: undefined } : item
      );
      return { order: { ...state.order, items } };
    }),
}));
