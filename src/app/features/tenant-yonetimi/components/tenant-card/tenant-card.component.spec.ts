import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantCardComponent } from './tenant-card.component';

describe('TenantCardComponent', () => {
  let component: TenantCardComponent;
  let fixture: ComponentFixture<TenantCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
