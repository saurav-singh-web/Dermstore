// src/types/product.d.ts

export interface Product {
  _id: string;           // future MongoDB compatibility
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
  rating: number;
  
  brand?: string;
  stock?: number;
  ingredients?: string[];
  directions?: string;
  benefits?: string[];
  sizes?: string[];
  tags?: string[];
  reviews?: { user: string; rating: number; comment: string }[];
}
  