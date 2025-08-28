export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  badge?: 'new' | 'hit' | 'sale';
  image?: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type CategoryFilter = 'all' | 'home' | 'games' | 'jewelry' | 'tools' | 'robotics';