import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcomptesComponent } from './comptes.component';

describe('LcomptesComponent', () => {
  let component: LcomptesComponent;
  let fixture: ComponentFixture<LcomptesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcomptesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LcomptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
