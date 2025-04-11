import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentRatioComponent } from './sentiment-ratio.component';

describe('SentimentRatioComponent', () => {
  let component: SentimentRatioComponent;
  let fixture: ComponentFixture<SentimentRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SentimentRatioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentimentRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
