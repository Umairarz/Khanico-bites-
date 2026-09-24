export type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItemDTO = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderDTO = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  deliveryLine1: string;
  deliveryCity: string;
  orderNotes: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
  items: OrderItemDTO[];
};
