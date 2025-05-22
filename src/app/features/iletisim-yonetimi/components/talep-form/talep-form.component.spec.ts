import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalepFormComponent } from './talep-form.component';

describe('TalepFormComponent', () => {
  let component: TalepFormComponent;
  let fixture: ComponentFixture<TalepFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalepFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalepFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
