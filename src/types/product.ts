export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
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