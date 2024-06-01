import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '@frontend/utils';
import { enviroment } from '@frontend/utils';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    constructor(private http: HttpClient) {}

    apiUrl = enviroment.apiUrl;

    getProducts(filterBy?: string[]): Observable<Product[]> {
        let queryParams = new HttpParams();
        if (filterBy) {
            queryParams = queryParams.append('categories', filterBy.join(','));
        }

        return this.http.get<Product[]>(`${this.apiUrl}products`, {
            params: queryParams,
        });
    }

    getProductById(productId: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}products/${productId}`);
    }

    addProduct(productData: FormData): Observable<Product> {
        return this.http.post<Product>(`${this.apiUrl}products`, productData);
    }

    editProduct(productData: FormData): Observable<Product> {
        return this.http.put<Product>(
            `${this.apiUrl}products/${productData.get('id')}`,
            productData
        );
    }

    editProductGallery(
        productData: FormData,
        productId: string
    ): Observable<Product> {
        return this.http.put<Product>(
            `${this.apiUrl}products/gallery-images/${productId}`,
            productData
        );
    }

    deleteProduct(productId: string): Observable<Product> {
        return this.http.delete<Product>(`${this.apiUrl}products/${productId}`);
    }

    getProductsCount(): Observable<{ productsCount: number }> {
        return this.http.get<{ productsCount: number }>(
            `${this.apiUrl}products/get/count`
        );
    }

    getFeaturedProducts(count: number): Observable<Product[]> {
        return this.http.get<Product[]>(
            `${this.apiUrl}products/get/featured/${count}`
        );
    }
}
