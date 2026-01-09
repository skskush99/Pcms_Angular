import { HttpClient, HttpParams, HttpHeaders , HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  token: string | null = "";
  
    constructor(private http: HttpClient, private url: UrlService) {
      this.token = localStorage.getItem("token")
    }
  
    get<T>(url: string, params?: HttpParams | any): Observable<T> {
      return this.http.get<T>(url, { params })
    }
  
  
    post<T>(url: string, body?: any, headers?: HttpHeaders): Observable<T> {
      return this.http.post<T>(url, body, { headers })
    }
  
    setToken(upcomingToken: string) {
      this.token = upcomingToken;
      localStorage.setItem("token", upcomingToken);
    }
  
}
