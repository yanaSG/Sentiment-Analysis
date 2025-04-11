import { Component, OnInit } from '@angular/core';
import { Chart, LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend, DoughnutController, ArcElement } from 'chart.js';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-sentiment-ratio',
  standalone: false,
  templateUrl: './sentiment-ratio.component.html',
  styleUrls: ['./sentiment-ratio.component.css']
})
export class SentimentRatioComponent implements OnInit {
  chart: any = [];
  results!: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.results$.subscribe((result) => {
      if (result) {
        this.results = result;
      }
    })

    if (this.results) {
      const negative = this.results.ratios_subjectivity.ratios.negative;
      const positive = this.results.ratios_subjectivity.ratios.positive;
      const neutral = this.results.ratios_subjectivity.ratios.neutral;

      Chart.register(LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend, DoughnutController, ArcElement);

      this.chart = new Chart('canvas', {
        type: 'doughnut',
        data: {
          labels: ['Negative', 'Neutral', 'Positive'],
          datasets: [{
            label: 'Sentiment Distribution',
            data: [negative, neutral, positive],
            backgroundColor: [
              '#F95A27',
              '#FFD65A', 
              '#A3D65A'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: 2
          },
          plugins: {
            legend: {
              position: 'right',
              align: 'center',
              labels: {
                boxWidth: 25,
                padding: 15,
                font: {
                  size: 12,
                  family: 'Arial',
                  color: '#333'
                } as any
              }
            },
          }
        }
      });  
    }
    
  }
}