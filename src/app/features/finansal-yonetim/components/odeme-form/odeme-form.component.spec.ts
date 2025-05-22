import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdemeFormComponent } from './odeme-form.component';

describe('OdemeFormComponent', () => {
  let component: OdemeFormComponent;
  let fixture: ComponentFixture<OdemeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OdemeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdemeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
