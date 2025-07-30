import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h2>📦 StockFlow</h2>
      </div>
      
      <div class="nav-menu" [class.active]="isMenuOpen">
        <a 
          routerLink="/dashboard" 
          class="nav-link"
          [class.active]="currentRoute === '/dashboard'"
          (click)="closeMenu()">
          🏠 Dashboard
        </a>
        <a 
          routerLink="/stores" 
          class="nav-link"
          [class.active]="currentRoute === '/stores' || currentRoute.startsWith('/stores/')"
          (click)="closeMenu()">
          🏪 Stores
        </a>
        <a 
          routerLink="/stocks" 
          class="nav-link"
          [class.active]="currentRoute === '/stocks'"
          (click)="closeMenu()">
          📋 All Stock
        </a>
        <a 
          routerLink="/products" 
          class="nav-link"
          [class.active]="currentRoute === '/products'"
          (click)="closeMenu()">
          🏷️ Products
        </a>
      </div>

      <button class="menu-toggle" (click)="toggleMenu()">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-brand h2 {
      color: #2563eb;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .nav-menu {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .nav-link {
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      color: #6b7280;
      font-weight: 600;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-link:hover {
      background: #f3f4f6;
      color: #2563eb;
    }

    .nav-link.active {
      background: #2563eb;
      color: white;
    }

    .menu-toggle {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      gap: 4px;
    }

    .menu-toggle span {
      width: 24px;
      height: 3px;
      background: #2563eb;
      border-radius: 2px;
      transition: 0.3s;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 0 16px;
      }

      .nav-brand h2 {
        font-size: 20px;
      }

      .menu-toggle {
        display: flex;
      }

      .nav-menu {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        gap: 0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
      }

      .nav-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .nav-link {
        padding: 16px 24px;
        border-radius: 0;
        border-bottom: 1px solid #e5e7eb;
        justify-content: flex-start;
      }

      .nav-link:last-child {
        border-bottom: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentRoute = '';
  isMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}