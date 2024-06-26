import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterModule,
} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { filter, map, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { Column, CountryPipe, User } from '@frontend/utils';
import { UsersService, ViewportSizeService } from '@frontend/shared';

@Component({
    selector: 'admin-users-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterModule,
        ToastModule,
        ButtonModule,
        TableModule,
        ConfirmDialogModule,
        TagModule,
        CountryPipe,
    ],
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
    constructor(
        private usersService: UsersService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
        private viewportSizeService: ViewportSizeService
    ) {}

    cols: Column[] = [
        { field: 'name', header: 'Name' },
        { field: 'email', header: 'Email' },
        { field: 'isAdmin', header: 'Admin' },
        { field: 'country', header: 'Country' },
    ];
    users!: User[];
    urlChangesSubscription!: Subscription;
    isDesktop!: boolean;

    ngOnInit() {
        this._observeViewportSize();
        this.getUsers();
        this.listenUrlChanges();
    }

    private _observeViewportSize() {
        this.viewportSizeService.viewportWidth$
            .pipe(map((viewportWidth) => viewportWidth >= 1025))
            .subscribe((isDesktop) => {
                this.isDesktop = isDesktop;
            });
    }

    getUsers() {
        this.usersService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
            },
            error: (err) => {
                console.error('Cannot get users', err);
            },
        });
    }

    onDeleteUser(userId: string) {
        this.confirmationService.confirm({
            header: 'Delete User',
            message: 'Are you sure you want to delete this User?',
            accept: () => {
                this.usersService.deleteUser(userId).subscribe({
                    next: (deletedUser) => {
                        this.users = this.users.filter(
                            (user) => user.id !== deletedUser.id
                        );

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `The user "${deletedUser.name}" is deleted successfully!`,
                        });
                    },
                    error: (err) => {
                        console.error('Cannot delete user', err);
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
                    this.getUsers();
                },
                error: (err) => {
                    console.error('Cannot get url changes!', err);
                },
            });
    }

    ngOnDestroy(): void {
        this.urlChangesSubscription?.unsubscribe();
    }
}
