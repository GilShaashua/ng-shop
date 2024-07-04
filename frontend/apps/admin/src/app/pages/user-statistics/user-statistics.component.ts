import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersService } from '@frontend/shared';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'admin-user-statistics',
    standalone: true,
    imports: [CommonModule, BaseChartDirective, RouterModule],
    templateUrl: './user-statistics.component.html',
    styleUrl: './user-statistics.component.scss',
})
export class UserStatisticsComponent implements OnInit {
    constructor(private usersService: UsersService) {}

    chart!: any;

    ngOnInit(): void {
        this._getUserStatistics();
    }

    private _getUserStatistics() {
        this.usersService.getUserStatistics().subscribe({
            next: (usersMap) => {
                this.chart = {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(usersMap).map((key) => {
                            if (key === 'notAdmin') return 'Not Admin';
                            else return 'Admin';
                        }),
                        datasets: [
                            {
                                label: 'Count',
                                data: Object.values(usersMap),
                                backgroundColor: [
                                    // 'rgb(255, 99, 132)',
                                    // 'rgb(54, 162, 235)',
                                    'rgb(255, 205, 86)',
                                    'rgb(75, 192, 192)',
                                    // 'rgb(153, 102, 255)',
                                    // 'rgb(255, 159, 64)',
                                    // 'rgb(25, 25, 112)',
                                    // 'rgb(0, 128, 128)',
                                    // 'rgb(255, 69, 0)',
                                    // 'rgb(255, 215, 0)',
                                    // 'rgb(0, 128, 0)',
                                    // 'rgb(128, 0, 128)',
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
