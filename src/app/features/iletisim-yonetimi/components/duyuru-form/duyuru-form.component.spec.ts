import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuyuruFormComponent } from './duyuru-form.component';

describe('DuyuruFormComponent', () => {
  let component: DuyuruFormComponent;
  let fixture: ComponentFixture<DuyuruFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuyuruFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuyuruFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
