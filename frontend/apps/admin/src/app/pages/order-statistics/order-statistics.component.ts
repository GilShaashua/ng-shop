import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrdersService } from '@frontend/shared';
import { BaseChartDirective } from 'ng2-charts';
import { map } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'admin-order-statistics',
    standalone: true,
    imports: [
        CommonModule,
        BaseChartDirective,
        RouterModule,
        DropdownModule,
        FormsModule,
    ],
    templateUrl: './order-statistics.component.html',
    styleUrl: './order-statistics.component.scss',
})
export class OrderStatisticsComponent implements OnInit {
    constructor(private ordersService: OrdersService) {}

    monthMap: { [key: string]: string } = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    };

    chart!: any;
    years!: string[];
    amountOrdersPerYear!: number;
    filterBy = { dateOrdered: '' };

    ngOnInit(): void {
        this._getOrdersYears();
    }

    private _getOrdersYears() {
        this.ordersService.getOrdersYears().subscribe(({ years }) => {
            this.years = years;
            this.filterBy.dateOrdered = this.years[0];
            this.getOrderStatistics();
        });
    }

    getOrderStatistics() {
        this.ordersService
            .getOrderStatistics(this.filterBy)
            .pipe(
                map(({ ordersMap }) => {
                    const modifiedOrdersMap: { [key: string]: number } = {};

                    for (const monthKey in ordersMap) {
                        const monthName = this.monthMap[monthKey];

                        modifiedOrdersMap[monthName] = ordersMap[monthKey];
                    }

                    return { ordersMap: modifiedOrdersMap };
                })
            )
            .subscribe({
                next: ({ ordersMap }) => {
                    const chart = {
                        type: 'doughnut',
                        data: {
                            labels: Object.keys(ordersMap),
                            datasets: [
                                {
                                    label: 'Orders',
                                    data: Object.values(ordersMap),
                                    backgroundColor: [
                                        'rgb(255, 99, 132)',
                                        'rgb(54, 162, 235)',
                                        'rgb(255, 205, 86)',
                                        'rgb(75, 192, 192)',
                                        'rgb(153, 102, 255)',
                                        'rgb(255, 159, 64)',
                                        'rgb(25, 25, 112)',
                                        'rgb(0, 128, 128)',
                                        'rgb(255, 69, 0)',
                                        'rgb(255, 215, 0)',
                                        'rgb(0, 128, 0)',
                                        'rgb(128, 0, 128)',
                                    ],
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

                    // Total amount of orders
                    this.amountOrdersPerYear = Object.values(ordersMap).reduce(
                        (acc, item) => acc + item,
                        0
                    );

                    this.chart = chart;
                },
            });
    }
}
