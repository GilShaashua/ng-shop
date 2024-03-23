import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    constructor(private http: HttpClient) {}

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(
            'http://localhost:3000/api/v1/categories'
        );
    }

    getCategoryById(categoryId: string): Observable<Category> {
        return this.http.get<Category>(
            `http://localhost:3000/api/v1/categories/${categoryId}`
        );
    }

    addCategory(category: Category): Observable<Category> {
        return this.http.post(
            'http://localhost:3000/api/v1/categories',
            category
        );
    }

    editCategory(category: Category): Observable<Category> {
        return this.http.put(
            `http://localhost:3000/api/v1/categories/${category.id}`,
            category
        );
    }

    deleteCategory(categoryId: string): Observable<Category> {
        return this.http.delete(
            `http://localhost:3000/api/v1/categories/${categoryId}`
        );
    }
}
