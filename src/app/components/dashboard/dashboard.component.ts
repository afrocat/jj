import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreService } from '../../../services/store.service';
import { StockService } from '../../../services/stock.service';
import { Store } from '../../../models/store.model';
import { Stock, Product } from '../../../models/stock.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1>Stock Management Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🏪</div>
          <div class="stat-content">
            <h3>{{ totalStores }}</h3>
            <p>Total Stores</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <h3>{{ totalStocks }}</h3>
            <p>Stock Items</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🏷️</div>
          <div class="stat-content">
            <h3>{{ totalProducts }}</h3>
            <p>Products</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⚠️</div>
          <div class="stat-content">
            <h3>{{ lowStockCount }}</h3>
            <p>Low Stock</p>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="recent-section">
          <h2>Recent Stores</h2>
          <div class="list-container">
            <div *ngFor="let store of recentStores" class="list-item">
              <div class="item-info">
                <h4>{{ store.name }}</h4>
                <p>{{ store.location }}</p>
              </div>
              <a [routerLink]="['/stores', store.id]" class="view-btn">View</a>
            </div>
          </div>
        </div>

        <div class="recent-section">
          <h2>Low Stock Items</h2>
          <div class="list-container">
            <div *ngFor="let stock of lowStockItems" class="list-item">
              <div class="item-info">
                <h4>{{ stock.sku }}</h4>
                <p>Quantity: {{ stock.quantity }}</p>
              </div>
              <span class="warning-badge">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      background: #f8fafc;
      min-height: 100vh;
    }

    h1 {
      color: #2563eb;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 32px;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      font-size: 32px;
      width: 60px;
      height: 60px;
      background: #facc15;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-content h3 {
      font-size: 28px;
      font-weight: 700;
      color: #2563eb;
      margin: 0;
    }

    .stat-content p {
      color: #6b7280;
      margin: 4px 0 0 0;
      font-size: 14px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 32px;
    }

    .recent-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .recent-section h2 {
      color: #2563eb;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .list-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .list-item:hover {
      background: #e2e8f0;
    }

    .item-info h4 {
      margin: 0;
      color: #1f2937;
      font-weight: 600;
    }

    .item-info p {
      margin: 4px 0 0 0;
      color: #6b7280;
      font-size: 14px;
    }

    .view-btn {
      background: #2563eb;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .view-btn:hover {
      background: #1d4ed8;
    }

    .warning-badge {
      background: #facc15;
      color: #1f2937;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalStores = 0;
  totalStocks = 0;
  totalProducts = 0;
  lowStockCount = 0;
  recentStores: Store[] = [];
  lowStockItems: Stock[] = [];

  constructor(
    private storeService: StoreService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.storeService.getAllStores().subscribe(stores => {
      this.totalStores = stores.length;
      this.recentStores = stores.slice(0, 5);
    });

    this.stockService.getAllStocks().subscribe(stocks => {
      this.totalStocks = stocks.length;
      this.lowStockItems = stocks.filter(stock => stock.quantity < 10).slice(0, 5);
      this.lowStockCount = stocks.filter(stock => stock.quantity < 10).length;
    });

    this.stockService.getAllProducts().subscribe(products => {
      this.totalProducts = products.length;
    });
  }
}