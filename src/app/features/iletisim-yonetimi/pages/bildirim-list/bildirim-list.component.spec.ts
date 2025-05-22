import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BildirimListComponent } from './bildirim-list.component';

describe('BildirimListComponent', () => {
  let component: BildirimListComponent;
  let fixture: ComponentFixture<BildirimListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BildirimListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BildirimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
