export interface ServerToClientEvents {
  'order-state': (order: any) => void;
  'order-updated': (order: any) => void;
}

export interface ClientToServerEvents {
  'join-table': (tableId: string) => void;
  'claim-item': (data: { orderId: string; itemId: string; userId: string }) => void;
  'unclaim-item': (data: { orderId: string; itemId: string }) => void;
}
