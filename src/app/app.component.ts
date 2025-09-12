import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  template: `
    <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-semibold fm-playfair" [routerLink]="['/inicio']">
          <!--<img src="assets/logo.png" alt="Veritas Dei" class="navbar-brand" width="30" height="30">-->
          <i class="bi bi-stars"></i>
          Veritas Dei
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"
          aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" [routerLink]="['/inicio']" (click)="fecharMenu()">
              <i class="bi bi-house"></i>
              Início
            </a>
          </li>
            <li class="nav-item">
              <a class="nav-link" [routerLink]="['/chat']" (click)="fecharMenu()">
              <i class="bi bi-chat"></i>
              Chat
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/pagar']" (click)="fecharMenu()">
              <i class="bi bi-cash"></i>
              Planos
            </a>
          </li>
          <li class="nav-item" *ngIf="mostrarInstalar">
            <button class="btn btn-sm btn-primary ms-lg-3" (click)="instalarPwa()">
              <i class="bi bi-download"></i>
              Instalar app
            </button>
          </li>
          </ul>
        </div>
      </div>
    </nav>
    <main class="container-lg">
      <router-outlet />
    </main>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'veritas-dei';
  private deferredPrompt: any | null = null;
  mostrarInstalar = false;

  fecharMenu() {
    const nav = document.getElementById('nav');
    if (nav?.classList.contains('show')) {
      nav.classList.remove('show');
    }
  }

  ngOnInit(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredPrompt = event as any;
      this.mostrarInstalar = true;
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.mostrarInstalar = false;
    });
  }

  async instalarPwa(): Promise<void> {
    if (!this.deferredPrompt) {
      return;
    }
    const promptEvent = this.deferredPrompt;
    this.deferredPrompt = null;
    await promptEvent.prompt();
    try {
      await promptEvent.userChoice;
    } finally {
      this.mostrarInstalar = false;
    }
  }
}
