import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SentimentAnalysisRoutingModule } from './sentiment-analysis-routing.module';
import { SentimentAnalysisComponent } from './sentiment-analysis.component';
import { LogComponent } from './log/log.component';
import { HeaderComponent } from './header/header.component';
import { MainResultComponent } from './main-result/main-result.component';
import { SentimentRatioComponent } from './sentiment-ratio/sentiment-ratio.component';
import { DetectedScoresMagnitudesComponent } from './detected-scores-magnitudes/detected-scores-magnitudes.component';
import { MainComponent } from './main/main.component';
import { ButtonComponent } from './button/button.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SentimentAnalysisComponent,
    LogComponent,
    HeaderComponent,
    MainResultComponent,
    SentimentRatioComponent,
    DetectedScoresMagnitudesComponent,
    MainComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    SentimentAnalysisRoutingModule,
    ReactiveFormsModule
  ]
})
export class SentimentAnalysisModule { }
