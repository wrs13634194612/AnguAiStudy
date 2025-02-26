import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalnumComponent } from './calnum.component';

describe('CalnumComponent', () => {
  let component: CalnumComponent;
  let fixture: ComponentFixture<CalnumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalnumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalnumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
