import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CategoriesService } from '@frontend/shared';
import { Category, Column } from '@frontend/utils';

@Component({
    selector: 'admin-categories',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        RouterLink,
        RouterOutlet,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
    ],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
    constructor(
        private categoriesService: CategoriesService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    cols: Column[] = [
        { field: 'name', header: 'Name' },
        { field: 'icon', header: 'Icon' },
        { field: 'color', header: 'Color' },
    ];

    categories!: Category[];
    urlChangesSubscription!: Subscription;

    ngOnInit() {
        this.getCategories();
        this.listenUrlChanges();
    }

    getCategories() {
        this.categoriesService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (err) => {
                console.error('Cannot get categories', err);
            },
        });
    }

    onDeleteCategory(categoryId: string) {
        this.confirmationService.confirm({
            header: 'Delete Category',
            message: 'Are you sure you want to delete this Category?',
            accept: () => {
                this.categoriesService.deleteCategory(categoryId).subscribe({
                    next: (deletedCategory) => {
                        this.categories = this.categories.filter(
                            (category) => category.id !== deletedCategory.id
                        );

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `The category "${deletedCategory.name}" is deleted successfully!`,
                        });
                    },
                    error: (err) => {
                        console.error('Cannot delete category', err);
                    },
                });
            },
            reject: () => {},
        });
    }

    listenUrlChanges() {
        this.urlChangesSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe({
                next: () => {
                    this.getCategories();
                },
                error: (err) => {
                    console.error('Cannot get url changes!', err);
                },
            });
    }

    ngOnDestroy(): void {
        this.urlChangesSubscription?.unsubscribe();
    }
}
