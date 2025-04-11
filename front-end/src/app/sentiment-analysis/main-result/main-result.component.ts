import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-main-result',
  standalone: false,
  templateUrl: './main-result.component.html',
  styleUrl: './main-result.component.css'
})
export class MainResultComponent implements OnInit {
  results!: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.results$.subscribe((result) => {
      if (result) {
        this.results = result;
      }
    })
  }
}
