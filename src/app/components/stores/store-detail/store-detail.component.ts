import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../../../services/store.service';
import { StockService } from '../../../../services/stock.service';
import { Store } from '../../../../models/store.model';
import { Stock } from '../../../../models/stock.model';

@Component({
  selector: 'app-store-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container" *ngIf="store">
      <div class="header">
        <div class="store-info">
          <h1>{{ store.name }}</h1>
          <p class="location">📍 {{ store.location }}</p>
        </div>
        <button class="primary-btn" (click)="showAddStock = true">Add Stock</button>
      </div>

      <div class="stocks-section">
        <h2>Stock Inventory</h2>
        <div *ngIf="stocks.length === 0" class="no-data">
          No stock items found for this store.
        </div>
        <div class="stocks-table" *ngIf="stocks.length > 0">
          <div class="table-header">
            <div>SKU</div>
            <div>Quantity</div>
            <div>Actions</div>
          </div>
          <div *ngFor="let stock of stocks" class="table-row">
            <div class="sku">{{ stock.sku }}</div>
            <div class="quantity" [class.low-stock]="stock.quantity < 10">
              {{ stock.quantity }}
            </div>
            <div class="actions">
              <button class="view-btn" (click)="viewTransactions(stock)">Transactions</button>
              <button class="edit-btn" (click)="editStock(stock)">Edit</button>
              <button class="delete-btn" (click)="deleteStock(stock.id!)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Stock Modal -->
      <div *ngIf="showAddStock || editingStock" class="modal-overlay" (click)="closeStockModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingStock ? 'Edit Stock' : 'Add New Stock' }}</h2>
            <button class="close-btn" (click)="closeStockModal()">×</button>
          </div>
          <form (ngSubmit)="saveStock()">
            <div class="form-group">
              <label>SKU</label>
              <input type="text" [(ngModel)]="currentStock.sku" name="sku" required>
            </div>
            <div class="form-group">
              <label>Quantity</label>
              <input type="number" [(ngModel)]="currentStock.quantity" name="quantity" required min="0">
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="closeStockModal()">Cancel</button>
              <button type="submit" class="primary-btn">{{ editingStock ? 'Update' : 'Add' }}</button>
            </div>
          </form>
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
      align-items: flex-start;
      margin-bottom: 32px;
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .store-info h1 {
      color: #2563eb;
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .location {
      color: #6b7280;
      font-size: 16px;
      margin: 0;
    }

    .primary-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .primary-btn:hover {
      background: #1d4ed8;
    }

    .stocks-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .stocks-section h2 {
      color: #2563eb;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 24px 0;
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
      grid-template-columns: 2fr 1fr 2fr;
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
      grid-template-columns: 2fr 1fr 2fr;
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

    .edit-btn {
      background: #facc15;
      color: #1f2937;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .edit-btn:hover {
      background: #eab308;
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

    form {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      color: #374151;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .form-group input[readonly] {
      background: #f3f4f6;
      color: #6b7280;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .cancel-btn {
      background: #6b7280;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .cancel-btn:hover {
      background: #4b5563;
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
        grid-template-columns: 1fr 80px 140px;
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
export class StoreDetailComponent implements OnInit {
  store: Store | null = null;
  stocks: Stock[] = [];
  showAddStock = false;
  editingStock: Stock | null = null;
  showTransactions = false;
  selectedStock: Stock | null = null;
  transactions: any[] = [];
  currentStock: Stock = { sku: '', quantity: 0 };

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    const storeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStore(storeId);
    this.loadStocks(storeId);
  }

  loadStore(id: number) {
    this.storeService.getStore(id).subscribe(store => {
      this.store = store;
    });
  }

  loadStocks(storeId: number) {
    this.storeService.getStoreStocks(storeId).subscribe(stocks => {
      this.stocks = stocks;
    });
  }

  editStock(stock: Stock) {
    this.editingStock = stock;
    this.currentStock = { ...stock };
  }

  deleteStock(id: number) {
    if (confirm('Are you sure you want to delete this stock item?')) {
      this.stockService.deleteStock(id).subscribe(() => {
        this.loadStocks(this.store!.id!);
      });
    }
  }

  viewTransactions(stock: Stock) {
    this.selectedStock = stock;
    this.showTransactions = true;
    if (stock.id) {
      this.stockService.getStockTransactions(stock.id).subscribe(transactions => {
        this.transactions = transactions;
      });
    }
  }

  saveStock() {
    if (this.editingStock) {
      this.stockService.updateStock(this.editingStock.id!, this.currentStock).subscribe(() => {
        this.loadStocks(this.store!.id!);
        this.closeStockModal();
      });
    } else {
      this.stockService.addStock(this.store!.id!, this.currentStock).subscribe(() => {
        this.loadStocks(this.store!.id!);
        this.closeStockModal();
      });
    }
  }

  closeStockModal() {
    this.showAddStock = false;
    this.editingStock = null;
    this.currentStock = { sku: '', quantity: 0 };
  }

  closeTransactionsModal() {
    this.showTransactions = false;
    this.selectedStock = null;
    this.transactions = [];
  }
}