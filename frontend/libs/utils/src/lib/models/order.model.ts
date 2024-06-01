import { OrderItem } from './order-item.model';
import { User } from './user.model';

export interface Order {
    id: string;
    orderItems: OrderItem[];
    shippingAddress1: string;
    shippingAddress2: string;
    city: string;
    zip?: string;
    country: string;
    phone: string;
    status: string;
    totalPrice?: string;
    user: User;
    dateOrdered: string;
}
