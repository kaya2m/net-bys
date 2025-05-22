import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidatFormComponent } from './aidat-form.component';

describe('AidatFormComponent', () => {
  let component: AidatFormComponent;
  let fixture: ComponentFixture<AidatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AidatFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AidatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
