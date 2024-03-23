import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    constructor(private http: HttpClient) {}

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(
            'http://localhost:3000/api/v1/products'
        );
    }

    getProductById(productId: string): Observable<Product> {
        return this.http.get<Product>(
            `http://localhost:3000/api/v1/products/${productId}`
        );
    }

    addProduct(productData: FormData): Observable<Product> {
        return this.http.post(
            'http://localhost:3000/api/v1/products',
            productData
        );
    }

    editProduct(productData: FormData): Observable<Product> {
        return this.http.put(
            `http://localhost:3000/api/v1/products/${productData.get('id')}`,
            productData
        );
    }

    deleteProduct(productId: string): Observable<Product> {
        return this.http.delete(
            `http://localhost:3000/api/v1/products/${productId}`
        );
    }
}
