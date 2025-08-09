import type { Product } from './product';

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtAdding: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalQuantity: number;
  totalPrice: number;
  createdAt: string;
  couponCode?: string;
  discountAmount?: number;
}
