export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface CartItem extends Product {
  quantity: number;
}
