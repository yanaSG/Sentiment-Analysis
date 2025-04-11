import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://127.0.0.1:8000/api/';
  constructor(private http: HttpClient) { }

  private resultsSubject = new BehaviorSubject<any>(null);
  results$ = this.resultsSubject.asObservable();

  sentimentAnalysis(text: any): Observable<any> {
    return this.http.post(`${this.apiUrl}sentiment-analysis/`, text);
  }

  getLogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}logs/`);
  }

  sendResults(result: any) {
    this.resultsSubject.next(result);
  }
}
