import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiderListComponent } from './gider-list.component';

describe('GiderListComponent', () => {
  let component: GiderListComponent;
  let fixture: ComponentFixture<GiderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
