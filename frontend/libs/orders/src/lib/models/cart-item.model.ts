import { Product } from '@frontend/products';

export interface CartItem {
    product: Product;
    quantity: number;
}
