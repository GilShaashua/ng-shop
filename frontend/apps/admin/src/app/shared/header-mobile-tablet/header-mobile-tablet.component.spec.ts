import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderMobileTabletComponent } from './header-mobile-tablet.component';

describe('HeaderMobileTabletComponent', () => {
    let component: HeaderMobileTabletComponent;
    let fixture: ComponentFixture<HeaderMobileTabletComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderMobileTabletComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderMobileTabletComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
