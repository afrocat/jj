import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../models/store.model';
import { Stock } from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAllStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.baseUrl}/stores`);
  }

  getStore(id: number): Observable<Store> {
    return this.http.get<Store>(`${this.baseUrl}/stores/${id}`);
  }

  addStore(store: Store): Observable<Store> {
    return this.http.post<Store>(`${this.baseUrl}/stores`, store);
  }

  updateStore(id: number, store: Store): Observable<Store> {
    return this.http.put<Store>(`${this.baseUrl}/stores/${id}`, store);
  }

  deleteStore(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/stores/${id}`);
  }

  deleteAllStores(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/stores`);
  }

  getStoreStocks(id: number): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseUrl}/stores/${id}/stocks`);
  }
}