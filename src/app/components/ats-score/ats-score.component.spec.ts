import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsScoreComponent } from './ats-score.component';

describe('AtsScoreComponent', () => {
  let component: AtsScoreComponent;
  let fixture: ComponentFixture<AtsScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtsScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtsScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
