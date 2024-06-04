import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@frontend/utils';
import { environment } from '@frontend/utils';

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    constructor(private http: HttpClient) {}

    apiUrl = environment.API_URL;

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}categories`);
    }

    getCategoryById(categoryId: string): Observable<Category> {
        return this.http.get<Category>(
            `${this.apiUrl}categories/${categoryId}`
        );
    }

    addCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(`${this.apiUrl}categories`, category);
    }

    editCategory(category: Category): Observable<Category> {
        return this.http.put<Category>(
            `${this.apiUrl}categories/${category.id}`,
            category
        );
    }

    deleteCategory(categoryId: string): Observable<Category> {
        return this.http.delete<Category>(
            `${this.apiUrl}categories/${categoryId}`
        );
    }
}
