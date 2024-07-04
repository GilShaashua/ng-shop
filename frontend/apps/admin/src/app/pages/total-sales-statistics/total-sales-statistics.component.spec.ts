import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSalesStatisticsComponent } from './total-sales-statistics.component';

describe('TotalSalesStatisticsComponent', () => {
  let component: TotalSalesStatisticsComponent;
  let fixture: ComponentFixture<TotalSalesStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalSalesStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalSalesStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
