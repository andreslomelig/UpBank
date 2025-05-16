import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UpdateBlockedStatusService {
  private apiUrl = 'http://localhost:3000/update_user_blocked_status';

  constructor(private http: HttpClient) {}

  updateUserBlockedStatus(email: string, blocked: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      email,
      blocked
    });
  }
}
