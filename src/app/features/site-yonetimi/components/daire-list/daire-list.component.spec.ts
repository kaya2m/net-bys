import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaireListComponent } from './daire-list.component';

describe('DaireListComponent', () => {
  let component: DaireListComponent;
  let fixture: ComponentFixture<DaireListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaireListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaireListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
