import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock, Transaction, Product, ConsumeStockRequest } from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  addStock(storeId: number, stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(`${this.baseUrl}/stocks/store/${storeId}`, stock);
  }

  updateStock(id: number, stock: Stock): Observable<Stock> {
    return this.http.put<Stock>(`${this.baseUrl}/stocks/${id}`, stock);
  }

  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseUrl}/stocks`);
  }

  getStock(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.baseUrl}/stocks/${id}`);
  }

  deleteStock(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/stocks/${id}`);
  }

  deleteAllStocks(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/stocks`);
  }

  consumeStock(storeId: number, sku: string, request: ConsumeStockRequest): Observable<any> {
    const params = new HttpParams()
      .set('storeId', storeId.toString())
      .set('sku', sku);
    
    return this.http.post(`${this.baseUrl}/stocks/consume`, request, { params });
  }

  getStockTransactions(id: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/stocks/${id}/transactions`);
  }

  checkProductAvailability(sku: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/stocks/products/${sku}/availability`);
  }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stocks/products`);
  }

  getProductsWithAvailability(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/stocks/products/availability`);
  }
}