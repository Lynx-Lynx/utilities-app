import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HistoryRecord } from "../components/history/history.interface";
import { environment } from "../environments/environment";

@Injectable({providedIn: 'root'})
export class HttpService {
  constructor(private http: HttpClient) {}

  public getHistory(): Observable<HistoryRecord[]> {
    return this.http.get<HistoryRecord[]>(`${environment.host}/api/utilities`);
  }
}