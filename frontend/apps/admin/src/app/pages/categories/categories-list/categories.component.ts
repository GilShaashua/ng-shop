import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CategoriesService, ViewportSizeService } from '@frontend/shared';
import { Category, Column } from '@frontend/utils';

@Component({
    selector: 'admin-categories',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        private confirmationService: ConfirmationService,
        private viewportSizeService: ViewportSizeService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    cols: Column[] = [
        { field: 'name', header: 'Name' },
        { field: 'icon', header: 'Icon' },
        { field: 'color', header: 'Color' },
    ];

    categories!: Category[];
    urlChangesSubscription!: Subscription;
    isDesktop!: boolean;

    ngOnInit() {
        this._observeViewportSize();
        this.getCategories();
        this.listenUrlChanges();
    }

    private _observeViewportSize() {
        this.viewportSizeService.viewportWidth$
            .pipe(map((viewportWidth) => viewportWidth >= 1025))
            .subscribe({
                next: (isDesktop) => {
                    this.isDesktop = isDesktop;
                    this.changeDetectorRef.markForCheck();
                },
            });
    }

    getCategories() {
        this.categoriesService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
                this.changeDetectorRef.markForCheck();
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

                        this.changeDetectorRef.markForCheck();
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

    trackByCategoryId(index: number, category: Category) {
        return category.id;
    }

    ngOnDestroy(): void {
        this.urlChangesSubscription?.unsubscribe();
    }
}
