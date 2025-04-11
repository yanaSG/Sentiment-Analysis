import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SentimentAnalysisComponent } from './sentiment-analysis/sentiment-analysis.component';

const routes: Routes = [
  { path: 'sentiment-analysis', loadChildren: () => import('./sentiment-analysis/sentiment-analysis.module').then(m => m.SentimentAnalysisModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
