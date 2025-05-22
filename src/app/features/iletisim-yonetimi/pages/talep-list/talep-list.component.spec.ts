import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalepListComponent } from './talep-list.component';

describe('TalepListComponent', () => {
  let component: TalepListComponent;
  let fixture: ComponentFixture<TalepListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalepListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
