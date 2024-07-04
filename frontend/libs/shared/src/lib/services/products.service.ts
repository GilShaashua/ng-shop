import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Product } from '@frontend/utils';
import { environment } from '@frontend/utils';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    constructor(private http: HttpClient) {}

    private _filterBy$ = new BehaviorSubject<{
        categories: string[];
        name: string;
    }>({ categories: [], name: '' });
    public filterBy$ = this._filterBy$.asObservable();

    private _products$ = new BehaviorSubject<Product[]>([]);
    public products$ = this._products$.asObservable();

    apiUrl = environment.API_URL;

    getProducts() {
        let queryParams = new HttpParams();

        if (this._filterBy$.value.categories.length) {
            queryParams = queryParams.append(
                'categories',
                this._filterBy$.value.categories.join(',')
            );
        }

        if (this._filterBy$.value.name) {
            queryParams = queryParams.append(
                'products',
                this._filterBy$.value.name
            );
        }

        const products$ = this.http.get<Product[]>(`${this.apiUrl}products`, {
            params: queryParams,
        });

        products$.pipe(take(1)).subscribe({
            next: (products) => {
                this._setProducts(products);
            },
            error: (err) => {
                console.error('err', err);
            },
        });
    }

    private _setProducts(products: Product[]) {
        this._products$.next(products);
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

    setFilterBy(filterBy: { categories: string[]; name: string }) {
        this._filterBy$.next(filterBy);
    }

    getProductStatistics(): Observable<{
        [key: string]: { categoryColor: string; count: number };
    }> {
        return this.http.get<{
            [key: string]: { categoryColor: string; count: number };
        }>(`${this.apiUrl}products/get/statistics`);
    }
}
