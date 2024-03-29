import { Pipe, PipeTransform } from '@angular/core';
import * as countriesLib from 'i18n-iso-countries';

@Pipe({
    name: 'country',
    standalone: true,
})
export class CountryPipe implements PipeTransform {
    transform(countryKey: string): string | null {
        const countryName = countriesLib.getName(countryKey, 'en');
        if (countryName) {
            return countryName;
        }
        return null;
    }
}
