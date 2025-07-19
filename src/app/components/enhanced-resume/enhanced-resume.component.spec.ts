import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnhancedResumeComponent } from './enhanced-resume.component';

describe('EnhancedResumeComponent', () => {
  let component: EnhancedResumeComponent;
  let fixture: ComponentFixture<EnhancedResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnhancedResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnhancedResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
