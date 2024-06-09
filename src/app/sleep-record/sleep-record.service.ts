import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { SleepRecord } from './sleep-record';

@Injectable({
  providedIn: 'root'
})
export class SleepRecordService {
  private apiUrl = 'https://localhost:7122/api/SleepRecords';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  getSleepRecords(): Observable<SleepRecord[]> {
    return this.httpClient.get<SleepRecord[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<SleepRecord[]>('getSleepRecords', []))
    );
  }

  getSleepRecord(id: number): Observable<SleepRecord> {
    return this.httpClient.get<SleepRecord>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<SleepRecord>(`getSleepRecord id=${id}`))
      );
  }

  addSleepRecord(sleepRecord: SleepRecord): Observable<SleepRecord> {
    return this.httpClient.post<SleepRecord>(this.apiUrl, sleepRecord, this.httpOptions)
      .pipe(
        catchError(this.handleError<SleepRecord>('addSleepRecord'))
      );
  }

  updateSleepRecord(sleepRecord: SleepRecord): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}/${sleepRecord.id}`, sleepRecord, this.httpOptions)
      .pipe(
        catchError(this.handleError<void>('updateSleepRecord'))
      );
  }

  deleteRecord(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError<void>('deleteSleepRecord'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`, error);

      return of(result as T);
    }
  }
}
