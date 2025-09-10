export interface ProductMedia {
  id: string;
  product_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  display_order: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  short_description?: string;
  long_description?: string;
  media?: ProductMedia[];
}

export interface OrderData {
  fullName: string;
  address: string;
  phoneNumber: string;
  notes: string;
  product: Product;
  orderQuantity: number;
  totalPrice: number;
}