import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

interface Keyword {
  [key: string]: {
    sentiment: string;
    score: number;
    magnitude: number;
  };
}

@Component({
  selector: 'app-detected-scores-magnitudes',
  standalone: false,
  templateUrl: './detected-scores-magnitudes.component.html',
  styleUrl: './detected-scores-magnitudes.component.css'
})
export class DetectedScoresMagnitudesComponent implements OnInit {
  results!: Keyword[];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.results$.subscribe((result) => {
      if (result) {
        this.results = result.keyword_score;
        console.log(this.results)
      }
    })
  }
}
