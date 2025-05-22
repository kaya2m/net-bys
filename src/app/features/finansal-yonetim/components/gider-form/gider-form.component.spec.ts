import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiderFormComponent } from './gider-form.component';

describe('GiderFormComponent', () => {
  let component: GiderFormComponent;
  let fixture: ComponentFixture<GiderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiderFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
