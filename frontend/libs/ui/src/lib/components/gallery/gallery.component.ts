import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-gallery',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss',
    host: { class: 'host-gallery' },
})
export class GalleryComponent implements OnInit {
    @Input() images?: string[];

    selectedImage = '';
    isLeftArrowShown = false;
    isRightArrowShown = true;
    imagesContainerScrollLeft = 0;

    ngOnInit(): void {
        if (this.images) {
            this.selectedImage = this.images[0];
        }
    }

    onSelectImage(idx: number) {
        if (this.images) {
            this.selectedImage = this.images[idx];
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
                this.isRightArrowShown = true;
                this.isLeftArrowShown = false;
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
}
