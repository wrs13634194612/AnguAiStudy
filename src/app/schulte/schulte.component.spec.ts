import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchulteComponent } from './schulte.component';

describe('SchulteComponent', () => {
  let component: SchulteComponent;
  let fixture: ComponentFixture<SchulteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchulteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchulteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
