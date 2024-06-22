import { CommonModule } from '@angular/common';
import {
    AfterContentChecked,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'ui-gallery',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss',
    host: { class: 'host-gallery' },
})
export class GalleryComponent implements OnInit, AfterContentChecked {
    @Input() images?: string[];
    @ViewChild('imagesContainer') elImages!: ElementRef;

    selectedImage = '';
    isLeftArrowShown = false;
    isRightArrowShown = true;
    imagesContainerScrollLeft = 0;
    activeImage = '';

    ngOnInit(): void {
        if (this.images) {
            this.selectedImage = this.images[0];
            this.activeImage = this.images?.[0];
        }
    }

    ngAfterContentChecked(): void {
        if (
            this.elImages &&
            this.elImages.nativeElement.scrollWidth ===
                this.elImages.nativeElement.offsetWidth
        ) {
            this.isRightArrowShown = false;
        }
    }

    onSelectImage(idx: number) {
        if (this.images) {
            this.selectedImage = this.images[idx];
            this.activeImage = this.images[idx];
        }
    }

    onClickArrowBtn(side: string, imagesContainer: HTMLElement) {
        const containerWidth = imagesContainer.offsetWidth;
        const scrollWidth = imagesContainer.scrollWidth;
        const scrollAmount = scrollWidth * 0.15; // Scroll amount based on 15% of container width

        if (side === 'left') {
            imagesContainer.scrollLeft -= scrollAmount; // Scroll left
            this.imagesContainerScrollLeft -= scrollAmount;

            if (this.imagesContainerScrollLeft === 0) {
                this.isLeftArrowShown = false;
            }

            if (this.imagesContainerScrollLeft > 0) {
                this.isRightArrowShown = true;
            }
        } else if (side === 'right') {
            imagesContainer.scrollLeft += scrollAmount; // Scroll right
            this.imagesContainerScrollLeft += scrollAmount;

            if (
                this.imagesContainerScrollLeft >=
                scrollWidth - containerWidth
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
}
