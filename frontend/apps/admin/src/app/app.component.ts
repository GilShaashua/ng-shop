import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    standalone: true,
    imports: [RouterOutlet],
    selector: 'admin-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    ngOnInit() {}
}
