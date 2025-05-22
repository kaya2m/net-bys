import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidatListComponent } from './aidat-list.component';

describe('AidatListComponent', () => {
  let component: AidatListComponent;
  let fixture: ComponentFixture<AidatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AidatListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AidatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
