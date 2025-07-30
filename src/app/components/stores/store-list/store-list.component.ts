import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../../../services/store.service';
import { Store } from '../../../../models/store.model';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="header">
        <h1>Store Management</h1>
        <button class="primary-btn" (click)="showAddForm = true">Add Store</button>
      </div>

      <div class="search-section">
        <input 
          type="text" 
          placeholder="Search stores..." 
          [(ngModel)]="searchTerm"
          (input)="filterStores()"
          class="search-input">
      </div>

      <div class="stores-grid">
        <div *ngFor="let store of filteredStores" class="store-card">
          <div class="store-header">
            <h3>{{ store.name }}</h3>
            <div class="actions">
              <button class="edit-btn" (click)="editStore(store)">Edit</button>
              <button class="delete-btn" (click)="deleteStore(store.id!)">Delete</button>
            </div>
          </div>
          <p class="location">📍 {{ store.location }}</p>
          <a [routerLink]="['/stores', store.id]" class="view-stocks-btn">View Stocks</a>
        </div>
      </div>

      <!-- Add/Edit Store Modal -->
      <div *ngIf="showAddForm || editingStore" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingStore ? 'Edit Store' : 'Add New Store' }}</h2>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>
          <form (ngSubmit)="saveStore()">
            <div class="form-group">
              <label>Store Name</label>
              <input type="text" [(ngModel)]="currentStore.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" [(ngModel)]="currentStore.location" name="location" required>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="primary-btn">{{ editingStore ? 'Update' : 'Add' }}</button>
            </div>
          </form>
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

    .stores-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .store-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .store-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .store-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .store-header h3 {
      color: #1f2937;
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 8px;
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

    .location {
      color: #6b7280;
      margin: 0 0 16px 0;
      font-size: 14px;
    }

    .view-stocks-btn {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.2s;
    }

    .view-stocks-btn:hover {
      background: #1d4ed8;
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

    @media (max-width: 768px) {
      .page-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .stores-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StoreListComponent implements OnInit {
  stores: Store[] = [];
  filteredStores: Store[] = [];
  searchTerm = '';
  showAddForm = false;
  editingStore: Store | null = null;
  currentStore: Store = { name: '', location: '' };

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.loadStores();
  }

  loadStores() {
    this.storeService.getAllStores().subscribe(stores => {
      this.stores = stores;
      this.filteredStores = stores;
    });
  }

  filterStores() {
    this.filteredStores = this.stores.filter(store =>
      store.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      store.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  editStore(store: Store) {
    this.editingStore = store;
    this.currentStore = { ...store };
  }

  deleteStore(id: number) {
    if (confirm('Are you sure you want to delete this store?')) {
      this.storeService.deleteStore(id).subscribe(() => {
        this.loadStores();
      });
    }
  }

  saveStore() {
    if (this.editingStore) {
      this.storeService.updateStore(this.editingStore.id!, this.currentStore).subscribe(() => {
        this.loadStores();
        this.closeModal();
      });
    } else {
      this.storeService.addStore(this.currentStore).subscribe(() => {
        this.loadStores();
        this.closeModal();
      });
    }
  }

  closeModal() {
    this.showAddForm = false;
    this.editingStore = null;
    this.currentStore = { name: '', location: '' };
  }
}