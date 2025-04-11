import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  results!: any;
  textForm: FormGroup;
  message!: string;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.textForm = this.fb.group({
      text: ['', Validators.required]
    })
  }

  analyzeText(): void {
    if (this.textForm.invalid) {
      return;
    }

    const text = {
      text: this.textForm.get('text')!.value
    }

    this.dataService.sentimentAnalysis(text).subscribe({
      next: response => {
        this.results = response;
        this.dataService.sendResults(this.results);
        this.message = '';
      },
      error: error => {
        this.message = 'Failed analyzing text: ' + error.error.message;
        return;
      }
    }) 
  }
}
