import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SentimentAnalysisComponent } from './sentiment-analysis.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SentimentAnalysisRoutingModule { }
