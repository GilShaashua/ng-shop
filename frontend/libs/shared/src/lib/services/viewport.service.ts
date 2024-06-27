import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ViewportSizeService {
    private _viewportWidth$ = new BehaviorSubject<number>(window.innerWidth);
    public viewportWidth$ = this._viewportWidth$.asObservable();

    constructor() {
        fromEvent(window, 'resize')
            .pipe(
                debounceTime(150),
                map((event) => (event.target as Window).innerWidth),
                startWith(window.innerWidth)
            )
            .subscribe({
                next: (currentWidth) => this._viewportWidth$.next(currentWidth),
            });
    }
}
