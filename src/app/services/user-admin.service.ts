import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiBaseUrl}/users`;

@Injectable({
  providedIn: 'root'
})

export class UserAdminService {
  private apiUrl = API_URL; 
  constructor(private http: HttpClient) {}

  getUsers(role?: string, page: number = 1, limit: number = 10): Observable<any> {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    if (role) {
      url += `&role=${role}`;
    }
    return this.http.get(url);
  }
  
}

