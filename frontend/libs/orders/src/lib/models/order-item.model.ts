import { Product } from '../../../../products/src/lib/models/product.model';

export interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
}
