import { Product } from './product.model';

export interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
}
