import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductsService } from '@frontend/shared';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'admin-product-statistics',
    standalone: true,
    imports: [CommonModule, RouterModule, BaseChartDirective],
    templateUrl: './product-statistics.component.html',
    styleUrl: './product-statistics.component.scss',
})
export class ProductStatisticsComponent implements OnInit {
    constructor(private productsService: ProductsService) {}

    chart!: any;

    ngOnInit(): void {
        this._getProductStatistics();
    }

    private _getProductStatistics() {
        this.productsService.getProductStatistics().subscribe({
            next: (productMap) => {
                this.chart = {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(productMap).map((key) => {
                            return key.charAt(0).toUpperCase() + key.slice(1);
                        }),
                        datasets: [
                            {
                                label: 'Products',
                                data: Object.values(productMap).map(
                                    (value) => value.count
                                ),
                                backgroundColor: Object.values(productMap).map(
                                    (value) => value.categoryColor
                                ),
                            },
                        ],
                    },
                    options: {
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'white',
                                    font: { size: 16 },
                                },
                            },
                        },
                    },
                };
            },
        });
    }
}
