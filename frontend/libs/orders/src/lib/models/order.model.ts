import { OrderItem } from './order-item.model';
import { User } from '@frontend/users';

export interface Order {
    id: string;
    orderItem: OrderItem;
    shippingAddress1: string;
    shippingAddress2: string;
    city: string;
    zip?: string;
    country: string;
    phone: string;
    status: string;
    totalPrice: string;
    user: User;
    dateOrdered: string;
}
