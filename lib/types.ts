export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: string;
}

export interface ShopInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  website: string;
}
