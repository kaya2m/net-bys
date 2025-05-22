import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuyuruListComponent } from './duyuru-list.component';

describe('DuyuruListComponent', () => {
  let component: DuyuruListComponent;
  let fixture: ComponentFixture<DuyuruListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuyuruListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuyuruListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
