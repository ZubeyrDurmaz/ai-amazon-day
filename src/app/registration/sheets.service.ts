import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Apps Script'i deploy ettikten sonra URL'yi buraya yapıştır
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6KhCbvEP95TrHFfvvBGh5GdRO02kg2udn8iGjGaNzEL0QElpcay_GJICkgVH5UXMn/exec';

@Injectable({ providedIn: 'root' })
export class SheetsService {
  constructor(private http: HttpClient) {}

  saveRegistration(data: object): Observable<any> {
    return this.http.post(APPS_SCRIPT_URL, JSON.stringify(data), {
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
    });
  }
}
