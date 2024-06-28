import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriesService } from '@frontend/shared';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
    selector: 'admin-categories-form',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        ColorPickerModule,
    ],
    templateUrl: './categories-form.component.html',
    styleUrl: './categories-form.component.scss',
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
    constructor(
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    form: FormGroup = this.formBuilder.group({
        id: [''],
        name: ['', [Validators.required, Validators.minLength(3)]],
        icon: ['', [Validators.required, Validators.minLength(3)]],
        color: ['#ffffff', [Validators.required]],
    });

    categoryId = '';
    isCmpInitialized = false;
    isSubmitted = false;
    paramsSubscription!: Subscription;

    ngOnInit(): void {
        this._checkParams();
    }

    onSubmitForm() {
        if (this.form.untouched) {
            if (this.categoryId) {
                return this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Edit atleast 1 field!',
                });
            } else {
                return this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Fill the fields first!',
                });
            }
        }
        this.isSubmitted = true;
        this.changeDetectorRef.markForCheck();
        if (this.form.invalid) return;

        // Check if its edit mode or add mode
        if (this.categoryId) {
            this._editCategory();
        } else {
            this._addCategory();
        }
    }

    private _checkParams() {
        this.paramsSubscription = this.route.params.subscribe((params) => {
            if (params['categoryId']) {
                this.categoriesService
                    .getCategoryById(params['categoryId'])
                    .subscribe({
                        next: (category) => {
                            this.categoryId = category.id!;
                            this.form.patchValue(category);
                            this.isCmpInitialized = true;
                            this.changeDetectorRef.markForCheck();
                        },
                        error: (err) => {
                            console.error('Cannot get category', err);
                        },
                    });
            } else {
                this.isCmpInitialized = true;
                this.changeDetectorRef.markForCheck();
            }
        });
    }

    private _addCategory() {
        this.categoriesService.addCategory(this.form.value).subscribe({
            next: async (addedCategory) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `The category "${addedCategory.name}" is created successfully!`,
                });

                this.changeDetectorRef.markForCheck();

                await firstValueFrom(timer(2000));
                this.router.navigateByUrl('/categories');
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'The category cannot be created!',
                });

                console.error('The category cannot be created!', err);
            },
        });
    }

    private _editCategory() {
        this.categoriesService.editCategory(this.form.value).subscribe({
            next: async (editedCategory) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `The category "${editedCategory.name}" is edited successfully!`,
                });

                this.changeDetectorRef.markForCheck();

                await firstValueFrom(timer(2000));
                this.router.navigateByUrl('/categories');
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'The category cannot be edited!',
                });

                console.error('Cannot edit category', err);
            },
        });
    }

    get controlsForm() {
        return this.form.controls;
    }

    ngOnDestroy(): void {
        this.paramsSubscription?.unsubscribe();
    }
}
