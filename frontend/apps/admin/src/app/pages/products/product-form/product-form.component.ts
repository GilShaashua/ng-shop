import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    CategoriesService,
    Category,
    ProductsService,
} from '@frontend/products';
import { MessageService } from 'primeng/api';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'admin-product-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        RouterLink,
        InputSwitchModule,
        DropdownModule,
    ],
    templateUrl: './product-form.component.html',
    styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit, OnDestroy {
    constructor(
        private formBuilder: FormBuilder,
        private productsService: ProductsService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private categoriesService: CategoriesService
    ) {}

    form: FormGroup = this.formBuilder.group({
        id: [''],
        name: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required, Validators.minLength(20)]],
        richDescription: ['', [Validators.required, Validators.minLength(40)]],
        image: ['', [Validators.required]],
        images: [''],
        brand: ['', [Validators.required, Validators.minLength(5)]],
        price: [0, [Validators.required]],
        category: ['', [Validators.required, Validators.minLength(3)]],
        countInStock: [0, [Validators.required]],
        rating: [0, [Validators.required]],
        numReviews: [0, [Validators.required]],
        isFeatured: [false],
    });

    categories!: Category[];

    productId = '';
    isCmpInitialized = false;
    isSubmitted = false;
    paramsSubscription!: Subscription;
    imageSelectedUrl: string | ArrayBuffer | null = null;
    formImage = '';

    ngOnInit(): void {
        this._checkParams();
        this._getCategories();
    }

    onSubmitForm() {
        if (this.form.untouched) {
            if (this.formImage === this.form.value.image) {
                if (this.productId) {
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
        }
        this.isSubmitted = true;
        if (this.form.invalid) return;

        // Create a form data for passing file to the backend (req.file)
        const productFormData = new FormData();
        const formKeys = Object.keys(this.form.value);
        formKeys.forEach((key) => {
            if (key === 'category') {
                productFormData.append(key, this.form.value[key].id);
            } else {
                productFormData.append(key, this.form.value[key]);
            }
        });

        // Check if its edit mode or add mode
        if (this.productId) {
            this._editProduct(productFormData);
        } else {
            this._addProduct(productFormData);
        }
    }

    isInputElement(target: EventTarget): target is HTMLInputElement {
        return target instanceof HTMLInputElement;
    }

    onImageUpload(ev: Event) {
        this.imageSelectedUrl = null;
        this.form.patchValue({ image: '' });

        if (ev.target && this.isInputElement(ev.target)) {
            const file = ev.target.files![0];

            if (file) {
                const fileReader = new FileReader();

                fileReader.onload = () => {
                    this.form.patchValue({ image: file });
                    this.form.get('image')?.updateValueAndValidity();
                    if (fileReader.result) {
                        this.imageSelectedUrl = fileReader.result;
                    }
                };

                fileReader.readAsDataURL(file);
            }
        }
    }

    private _checkParams() {
        this.paramsSubscription = this.route.params.subscribe((params) => {
            if (params['productId']) {
                this.productsService
                    .getProductById(params['productId'])
                    .subscribe({
                        next: (product) => {
                            this.formImage = product.image!;
                            this.productId = product.id!;
                            this.form.patchValue(product);
                            this.form.updateValueAndValidity();
                            this.isCmpInitialized = true;
                        },
                        error: (err) => {
                            console.error('Cannot get product', err);
                        },
                    });
            } else {
                this.isCmpInitialized = true;
            }
        });
    }

    private _getCategories() {
        this.categoriesService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (err) => {
                console.error('Cannot get categories', err);
            },
        });
    }

    private _addProduct(productFormData: FormData) {
        this.productsService.addProduct(productFormData).subscribe({
            next: async (addedProduct) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `The product "${addedProduct.name}" is created successfully!`,
                });

                await firstValueFrom(timer(2000));
                this.router.navigateByUrl('/products');
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'The product cannot be created!',
                });

                console.error('The product cannot be created!', err);
            },
        });
    }

    private _editProduct(productFormData: FormData) {
        this.productsService.editProduct(productFormData).subscribe({
            next: async (editedProduct) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `The product "${editedProduct.name}" is edited successfully!`,
                });

                await firstValueFrom(timer(2000));
                this.router.navigateByUrl('/products');
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'The product cannot be edited!',
                });

                console.error('Cannot edit product', err);
            },
        });
    }

    isImageFormControlString() {
        return typeof this.controlsForm['image'].value === 'string';
    }

    get controlsForm() {
        return this.form.controls;
    }

    ngOnDestroy(): void {
        this.paramsSubscription?.unsubscribe();
    }
}
