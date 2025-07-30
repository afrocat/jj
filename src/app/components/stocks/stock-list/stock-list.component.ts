import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../../services/stock.service';
import { Stock } from '../../../../models/stock.model';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="header">
        <h1>All Stock Items</h1>
        <div class="header-actions">
          <button class="danger-btn" (click)="deleteAllStocks()" *ngIf="stocks.length > 0">
            Clear All Stock
          </button>
        </div>
      </div>

      <div class="search-section">
        <input 
          type="text" 
          placeholder="Search by SKU..." 
          [(ngModel)]="searchTerm"
          (input)="filterStocks()"
          class="search-input">
      </div>

      <div class="stocks-section">
        <div *ngIf="filteredStocks.length === 0" class="no-data">
          {{ stocks.length === 0 ? 'No stock items found.' : 'No stock items match your search.' }}
        </div>
        
        <div class="stocks-table" *ngIf="filteredStocks.length > 0">
          <div class="table-header">
            <div>SKU</div>
            <div>Quantity</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          <div *ngFor="let stock of filteredStocks" class="table-row">
            <div class="sku">{{ stock.sku }}</div>
            <div class="quantity" [class.low-stock]="stock.quantity < 10">
              {{ stock.quantity }}
            </div>
            <div class="status">
              <span 
                class="status-badge" 
                [class.low-stock-badge]="stock.quantity < 10"
                [class.good-stock-badge]="stock.quantity >= 10">
                {{ stock.quantity < 10 ? 'Low Stock' : 'In Stock' }}
              </span>
            </div>
            <div class="actions">
              <button class="view-btn" (click)="viewTransactions(stock)">Transactions</button>
              <button class="delete-btn" (click)="deleteStock(stock.id!)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions Modal -->
      <div *ngIf="showTransactions && selectedStock" class="modal-overlay" (click)="closeTransactionsModal()">
        <div class="modal-content large-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Transactions for {{ selectedStock.sku }}</h2>
            <button class="close-btn" (click)="closeTransactionsModal()">×</button>
          </div>
          <div class="transactions-content">
            <div *ngIf="transactions.length === 0" class="no-data">
              No transactions found for this stock item.
            </div>
            <div *ngIf="transactions.length > 0" class="transactions-list">
              <div *ngFor="let transaction of transactions" class="transaction-item">
                <div class="transaction-info">
                  <span class="transaction-type" [class]="transaction.type.toLowerCase()">
                    {{ transaction.type }}
                  </span>
                  <span class="transaction-quantity">{{ transaction.quantity }}</span>
                </div>
                <div class="transaction-date">
                  {{ transaction.timestamp | date:'medium' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      background: #f8fafc;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header h1 {
      color: #2563eb;
      font-size: 32px;
      font-weight: 700;
      margin: 0;
    }

    .danger-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .danger-btn:hover {
      background: #dc2626;
    }

    .search-section {
      margin-bottom: 24px;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .stocks-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .no-data {
      text-align: center;
      color: #6b7280;
      padding: 40px;
      font-size: 16px;
    }

    .stocks-table {
      display: flex;
      flex-direction: column;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 2fr;
      gap: 16px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 2fr;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      align-items: center;
    }

    .table-row:hover {
      background: #f8fafc;
    }

    .sku {
      font-weight: 600;
      color: #1f2937;
    }

    .quantity {
      font-weight: 600;
      color: #059669;
    }

    .quantity.low-stock {
      color: #dc2626;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .good-stock-badge {
      background: #d1fae5;
      color: #065f46;
    }

    .low-stock-badge {
      background: #fee2e2;
      color: #991b1b;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .view-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .view-btn:hover {
      background: #1d4ed8;
    }

    .delete-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .delete-btn:hover {
      background: #dc2626;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 0;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .large-modal {
      max-width: 800px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      color: #2563eb;
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #1f2937;
    }

    .transactions-content {
      padding: 24px;
      max-height: 400px;
      overflow-y: auto;
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .transaction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .transaction-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .transaction-type {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .transaction-type.add {
      background: #d1fae5;
      color: #065f46;
    }

    .transaction-type.consume {
      background: #fef3c7;
      color: #92400e;
    }

    .transaction-type.update {
      background: #dbeafe;
      color: #1e40af;
    }

    .transaction-quantity {
      font-weight: 600;
      color: #1f2937;
    }

    .transaction-date {
      color: #6b7280;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .table-header,
      .table-row {
        grid-template-columns: 1fr 80px 80px 120px;
        gap: 8px;
      }

      .actions {
        flex-direction: column;
        gap: 4px;
      }

      .actions button {
        font-size: 10px;
        padding: 4px 8px;
      }
    }
  `]
})
export class StockListComponent implements OnInit {
  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  searchTerm = '';
  showTransactions = false;
  selectedStock: Stock | null = null;
  transactions: any[] = [];

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.stockService.getAllStocks().subscribe(stocks => {
      this.stocks = stocks;
      this.filteredStocks = stocks;
    });
  }

  filterStocks() {
    this.filteredStocks = this.stocks.filter(stock =>
      stock.sku.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteStock(id: number) {
    if (confirm('Are you sure you want to delete this stock item?')) {
      this.stockService.deleteStock(id).subscribe(() => {
        this.loadStocks();
      });
    }
  }

  deleteAllStocks() {
    if (confirm('Are you sure you want to delete ALL stock items? This action cannot be undone.')) {
      this.stockService.deleteAllStocks().subscribe(() => {
        this.loadStocks();
      });
    }
  }

viewTransactions(stock: Stock) {
  this.selectedStock = stock;
  this.showTransactions = true;
  if (stock.id) {
    this.stockService.getStockTransactions(stock.id).pipe(
      map(apiTransactions => {
        return apiTransactions.map(t => {
          return {
            stockId: stock.id, 
            quantity: t.consumedQuantity,
            timestamp: t.createdAt,     
            type: 'CONSUME', 
            id: t.id 
          } as Transaction; 
        });
      })
    ).subscribe(formattedTransactions => {
      this.transactions = formattedTransactions;
      console.log('Formatted transactions:', this.transactions); // Good for debugging
    });
  }
}

  closeTransactionsModal() {
    this.showTransactions = false;
    this.selectedStock = null;
    this.transactions = [];
  }
}
