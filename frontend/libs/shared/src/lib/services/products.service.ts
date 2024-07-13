import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Product } from '@frontend/utils';
import { environment } from '@frontend/utils';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    private _filterBy$ = new BehaviorSubject<{
        categories: string[];
        name: string;
    }>({ categories: [], name: '' });
    public filterBy$ = this._filterBy$.asObservable();

    private _products$ = new BehaviorSubject<{
        products: Product[];
        pageCount: number;
    }>({ products: [], pageCount: 0 });
    public products$ = this._products$.asObservable();

    apiUrl = environment.API_URL;

    getProducts({
        currPage,
        pageSize,
    }: {
        currPage?: string;
        pageSize?: string;
    } = {}): void {
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

        if (currPage && pageSize) {
            queryParams = queryParams.append('currPage', currPage);
            queryParams = queryParams.append('pageSize', pageSize);
        }

        const products$ = this.http.get<{
            products: Product[];
            pageCount: number;
        }>(`${this.apiUrl}products`, {
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

    private _setProducts(products: { products: Product[]; pageCount: number }) {
        this._products$.next(products);
    }

    getProductById(productId: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}products/${productId}`);
    }

    addProduct(productData: FormData): Observable<Product> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.post<Product>(`${this.apiUrl}products`, productData, {
            params,
        });
    }

    editProduct(productData: FormData): Observable<Product> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.put<Product>(
            `${this.apiUrl}products/${productData.get('id')}`,
            productData,
            { params }
        );
    }

    editProductGallery(
        productData: FormData,
        productId: string
    ): Observable<Product> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.put<Product>(
            `${this.apiUrl}products/gallery-images/${productId}`,
            productData,
            { params }
        );
    }

    deleteProduct(productId: string): Observable<Product> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.delete<Product>(
            `${this.apiUrl}products/${productId}`,
            { params }
        );
    }

    getProductsCount(): Observable<{ productsCount: number }> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<{ productsCount: number }>(
            `${this.apiUrl}products/get/count`,
            { params }
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
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<{
            [key: string]: { categoryColor: string; count: number };
        }>(`${this.apiUrl}products/get/statistics`, { params });
    }
}
