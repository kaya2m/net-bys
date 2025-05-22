import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlokListComponent } from './blok-list.component';

describe('BlokListComponent', () => {
  let component: BlokListComponent;
  let fixture: ComponentFixture<BlokListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlokListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlokListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
