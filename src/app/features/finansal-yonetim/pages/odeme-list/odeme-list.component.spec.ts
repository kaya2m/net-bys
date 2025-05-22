import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdemeListComponent } from './odeme-list.component';

describe('OdemeListComponent', () => {
  let component: OdemeListComponent;
  let fixture: ComponentFixture<OdemeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OdemeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdemeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
