import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-log',
  standalone: false,
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent implements OnInit {
  logs!: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getLogs().subscribe({
      next: response => {
        this.logs = [...response].reverse();;
      },
      error: error => {
        console.log("Error fetching logs: ", error);
      }
    })
  }
}
