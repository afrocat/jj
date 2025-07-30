import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../../services/stock.service';
import { Product } from '../../../../models/stock.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="header">
        <h1>Product Catalog</h1>
        <div class="search-section">
          <input 
            type="text" 
            placeholder="Search products..." 
            [(ngModel)]="searchTerm"
            (input)="filterProducts()"
            class="search-input">
        </div>
      </div>

      <div class="availability-checker">
        <h2>Check Product Availability</h2>
        <div class="checker-form">
          <input 
            type="text" 
            placeholder="Enter SKU to check availability..." 
            [(ngModel)]="checkSku"
            class="sku-input">
          <button class="check-btn" (click)="checkAvailability()" [disabled]="!checkSku">
            Check
          </button>
        </div>
        <div *ngIf="checkedProduct" class="availability-result">
          <div class="result-card" [class.available]="checkedProduct.totalQuantity && checkedProduct.totalQuantity > 0" [class.unavailable]="!checkedProduct.totalQuantity || checkedProduct.totalQuantity === 0">
            <div class="result-header">
              <h3>{{ checkedProduct.name }} ({{ checkedProduct.sku }})</h3>
              <span class="availability-badge" [class.available]="checkedProduct.totalQuantity && checkedProduct.totalQuantity > 0">
                {{ (checkedProduct.totalQuantity && checkedProduct.totalQuantity > 0) ? 'Available' : 'Unavailable' }}
              </span>
            </div>
            <p class="total-quantity">Total Quantity: {{ checkedProduct.totalQuantity || 0 }}</p>
            <p class="brand">Brand: {{ checkedProduct.brand }}</p>
            <p class="price">Price: ${{ checkedProduct.price }}</p>
          </div>
        </div>
      </div>

      <div class="products-section">
        <h2>All Products</h2>
        <div *ngIf="filteredProducts.length === 0" class="no-data">
          {{ products.length === 0 ? 'No products found.' : 'No products match your search.' }}
        </div>
        
        <div class="products-grid" *ngIf="filteredProducts.length > 0">
          <div *ngFor="let product of filteredProducts" class="product-card" [class.inactive]="!product.isActive">
            <div class="product-image">
              <img [src]="product.imageUrl" [alt]="product.name" (error)="onImageError($event)">
              <div class="status-overlay" *ngIf="!product.isActive">
                <span class="inactive-badge">Inactive</span>
              </div>
            </div>
            <div class="product-content">
              <div class="product-header">
                <h3>{{ product.name }}</h3>
                <span class="price">${{ product.price }}</span>
              </div>
              <div class="product-meta">
                <span class="brand">{{ product.brand }}</span>
                <span class="category">{{ product.categoryName }}</span>
              </div>
              <p class="description">{{ product.description }}</p>
              <div class="product-footer">
                <div class="sku-info">
                  <span class="sku-label">SKU:</span>
                  <span class="sku-value">{{ product.sku }}</span>
                </div>
                <div class="stock-info" *ngIf="product.totalQuantity !== undefined">
                  <span class="stock-quantity" [class.low-stock]="product.totalQuantity < 10 && product.totalQuantity > 0" [class.out-of-stock]="product.totalQuantity === 0">
                    {{ product.totalQuantity || 0 }} in stock
                  </span>
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

    .search-input {
      width: 300px;
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

    .availability-checker {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .availability-checker h2 {
      color: #2563eb;
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 20px 0;
    }

    .checker-form {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .sku-input {
      flex: 1;
      max-width: 400px;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }

    .sku-input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .check-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .check-btn:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .check-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .availability-result {
      margin-top: 20px;
    }

    .result-card {
      padding: 20px;
      border-radius: 8px;
      border: 2px solid;
    }

    .result-card.available {
      background: #f0fdf4;
      border-color: #22c55e;
    }

    .result-card.unavailable {
      background: #fef2f2;
      border-color: #ef4444;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .result-header h3 {
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    .availability-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .availability-badge.available {
      background: #22c55e;
      color: white;
    }

    .availability-badge:not(.available) {
      background: #ef4444;
      color: white;
    }

    .total-quantity, .brand, .price {
      color: #6b7280;
      margin: 4px 0;
      font-size: 14px;
    }

    .products-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .products-section h2 {
      color: #2563eb;
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 24px 0;
    }

    .no-data {
      text-align: center;
      color: #6b7280;
      padding: 40px;
      font-size: 16px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .product-card {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
      background: white;
    }

    .product-card:hover {
      border-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .product-card.inactive {
      opacity: 0.7;
      border-color: #9ca3af;
    }

    .product-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s;
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .status-overlay {
      position: absolute;
      top: 12px;
      right: 12px;
    }

    .inactive-badge {
      background: #ef4444;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .product-content {
      padding: 20px;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .product-header h3 {
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      flex: 1;
    }

    .price {
      color: #2563eb;
      font-size: 18px;
      font-weight: 700;
      margin-left: 12px;
    }

    .product-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
    }

    .brand, .category {
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
    }

    .brand {
      color: #facc15;
      font-weight: 600;
    }

    .description {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }

    .sku-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sku-label {
      color: #6b7280;
      font-size: 12px;
      font-weight: 500;
    }

    .sku-value {
      color: #1f2937;
      font-size: 12px;
      font-weight: 600;
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .stock-info {
      display: flex;
      align-items: center;
    }

    .stock-quantity {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      background: #d1fae5;
      color: #065f46;
    }

    .stock-quantity.low-stock {
      background: #fef3c7;
      color: #92400e;
    }

    .stock-quantity.out-of-stock {
      background: #fee2e2;
      color: #991b1b;
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

      .search-input {
        width: 100%;
      }

      .checker-form {
        flex-direction: column;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }

      .product-header {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
      }

      .price {
        margin-left: 0;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  checkSku = '';
  checkedProduct: Product | null = null;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.stockService.getAllProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  checkAvailability() {
    if (this.checkSku.trim()) {
      this.stockService.checkProductAvailability(this.checkSku.trim()).subscribe(product => {
        this.checkedProduct = product;
      });
    }
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=No+Image';
  }
}