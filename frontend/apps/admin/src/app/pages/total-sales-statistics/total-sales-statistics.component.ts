import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrdersService } from '@frontend/shared';
import { BaseChartDirective } from 'ng2-charts';
import { DropdownModule } from 'primeng/dropdown';
import { map } from 'rxjs';

@Component({
    selector: 'admin-total-sales-statistics',
    standalone: true,
    imports: [
        CommonModule,
        BaseChartDirective,
        RouterModule,
        DropdownModule,
        FormsModule,
    ],
    templateUrl: './total-sales-statistics.component.html',
    styleUrl: './total-sales-statistics.component.scss',
})
export class TotalSalesStatisticsComponent implements OnInit {
    constructor(private ordersService: OrdersService) {}

    chart!: any;
    filterBy = { dateOrdered: '' };
    monthsMap: { [key: string]: string } = {
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
    years!: string[];

    ngOnInit(): void {
        this._getOrdersYears();
    }

    private _getOrdersYears() {
        this.ordersService.getOrdersYears().subscribe(({ years }) => {
            this.filterBy.dateOrdered = years[0];
            this.years = years;
            this.getTotalSalesStatistics();
        });
    }

    getTotalSalesStatistics() {
        this.ordersService
            .getTotalSalesStatistics(this.filterBy)
            .pipe(
                map((ordersMap) => {
                    const modifiedOrdersMap: { [key: string]: number } = {};

                    for (const monthKey in ordersMap) {
                        const monthName = this.monthsMap[monthKey];

                        modifiedOrdersMap[monthName] = ordersMap[monthKey];
                    }

                    return modifiedOrdersMap;
                })
            )
            .subscribe({
                next: (ordersMap) => {
                    this.chart = {
                        type: 'doughnut',
                        data: {
                            labels: Object.keys(ordersMap),
                            datasets: [
                                {
                                    label: 'Total Sales',
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
                },
            });
    }
}
