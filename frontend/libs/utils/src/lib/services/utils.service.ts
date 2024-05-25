import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    constructor() {}

    private _isUsedByNgShop$ = new BehaviorSubject<boolean>(false);
    public isUsedByNgShop$ = this._isUsedByNgShop$.asObservable();

    setIsUsedByNgShop() {
        this._isUsedByNgShop$.next(true);
    }
}
