import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectedScoresMagnitudesComponent } from './detected-scores-magnitudes.component';

describe('DetectedScoresMagnitudesComponent', () => {
  let component: DetectedScoresMagnitudesComponent;
  let fixture: ComponentFixture<DetectedScoresMagnitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetectedScoresMagnitudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetectedScoresMagnitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
