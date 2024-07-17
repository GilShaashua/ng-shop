import { CommonModule } from '@angular/common';
import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ViewportSizeService } from '@frontend/shared';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'ui-gallery',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss',
    host: { class: 'host-gallery' },
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        private viewportSizeService: ViewportSizeService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    @Input() images?: string[];
    @ViewChild('imagesContainer') elImages!: ElementRef;
    @ViewChild('imagesInnerContainer') elImagesInner!: ElementRef;

    selectedImage = '';
    isLeftArrowShown = false;
    isRightArrowShown = true;
    imagesContainerScrollLeft = 0;
    activeImage = '';
    subscriptionSubject = new Subject<null>();

    containerWidth!: number;
    scrollWidth!: number;
    scrollAmount!: number;

    ngOnInit(): void {
        if (this.images) {
            this.selectedImage = this.images[0];
            this.activeImage = this.images?.[0];
        }
    }

    ngAfterViewInit(): void {
        this.viewportSizeService.viewportWidth$
            .pipe(takeUntil(this.subscriptionSubject))
            .subscribe({
                next: () => {
                    this.containerWidth =
                        this.elImages.nativeElement.offsetWidth;

                    this.scrollWidth = this.elImages.nativeElement.scrollWidth;
                    this.scrollAmount =
                        this.elImages.nativeElement.scrollWidth * 0.15; // Scroll amount based on 15% of container width

                    this.imagesContainerScrollLeft = 0;
                    this.isLeftArrowShown = false;
                    this.isRightArrowShown = true;
                    if (this.images) {
                        this.selectedImage = this.images[0];
                        this.activeImage = this.images[0];
                        this.elImages.nativeElement.scrollLeft = 0;
                    }

                    if (
                        this.elImagesInner.nativeElement.offsetWidth <
                        this.elImages.nativeElement.offsetWidth
                    ) {
                        this.isRightArrowShown = false;
                        this.isLeftArrowShown = false;
                    }

                    this.changeDetectorRef.markForCheck();
                },
            });
    }

    onSelectImage(idx: number) {
        if (this.images) {
            this.selectedImage = this.images[idx];
            this.activeImage = this.images[idx];
        }
    }

    onClickArrowBtn(side: string) {
        if (side === 'left') {
            this.elImages.nativeElement.scrollLeft -= this.scrollAmount; // Scroll left
            this.imagesContainerScrollLeft -= this.scrollAmount;

            if (this.imagesContainerScrollLeft === 0) {
                this.isLeftArrowShown = false;
                this.isRightArrowShown = true;
            }

            if (this.imagesContainerScrollLeft > 0) {
                this.isRightArrowShown = true;
            }
        } else if (side === 'right') {
            this.elImages.nativeElement.scrollLeft += this.scrollAmount; // Scroll right
            this.imagesContainerScrollLeft += this.scrollAmount;

            if (
                this.imagesContainerScrollLeft >=
                this.scrollWidth - this.containerWidth
            ) {
                this.isRightArrowShown = false;
            }

            if (this.imagesContainerScrollLeft > 0) {
                this.isLeftArrowShown = true;
            }
        }
    }

    trackByImage(index: number, image: string) {
        return image;
    }

    ngOnDestroy(): void {
        this.subscriptionSubject.next(null);
        this.subscriptionSubject.complete();
    }
}
