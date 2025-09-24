import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdminStatistics } from "../models/admin.interface";



@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private urlDashboard: string = 'http://localhost:9090/api/dashboard';

  private http = inject(HttpClient);

  getStatistics(): Observable<AdminStatistics> {
    return this.http.get<AdminStatistics>(
      `${this.urlDashboard}/admin/statistics`
    );
  }
}