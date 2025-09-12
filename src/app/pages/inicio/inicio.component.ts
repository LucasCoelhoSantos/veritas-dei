import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="py-5" style="background: radial-gradient(1200px 600px at 10% 80%, var(--bg-secondary), transparent) , radial-gradient(900px 500px at 90% 10%, var(--bg-secondary), transparent);">
      <div class="text-center mb-3">
        <span class="badge rounded-pill bg-warning-subtle text-warning-emphasis px-3 py-2">
          <i class="bi bi-check-circle"></i>
          Baseado na Tradição da Igreja
        </span>
      </div>

      <div class="text-center">
        <h1 class="display-3 fw-bold lh-1 fm-playfair">Assistente de <span class="text-primary">Fé Católica</span><br>com IA</h1>
        <p class="lead text-secondary mt-3">Respostas fundamentadas na Sagrada Escritura, Tradição e Magistério da Igreja</p>
      </div>

      <div class="row g-4 mt-4">
        <div class="col-12 col-md-4">
          <div class="card h-100 shadow-sm text-center">
            <div class="card-body">
              <div class="fs-2 mb-2">
                <i class="bi bi-book-half text-primary"></i>
              </div>
              <h3 class="h5 fm-playfair">Catecismo & Escrituras</h3>
              <p class="text-secondary small mb-0">Citações do Catecismo e passagens bíblicas</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card h-100 shadow-sm text-center">
            <div class="card-body">
              <div class="fs-2 mb-2">
                <i class="bi bi-shield-shaded text-primary"></i>
              </div>
              <h3 class="h5 fm-playfair">Doutrina Segura</h3>
              <p class="text-secondary small mb-0">Ensinos oficiais do Magistério</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card h-100 shadow-sm text-center">
            <div class="card-body">
              <div class="fs-2 mb-2">
                <i class="bi bi-stars text-primary"></i>
              </div>
              <h3 class="h5 fm-playfair">Fé Autêntica</h3>
              <p class="text-secondary small mb-0">2000 anos de Tradição Apostólica</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-4 d-flex gap-3 justify-content-center">
        <a routerLink="/chat" class="btn btn-primary btn-lg px-4">Começar Conversa Gratuita</a>
        <a routerLink="/pagar" class="btn btn-outline-secondary btn-lg px-4">Ver Planos</a>
      </div>

      <p class="text-center text-secondary small mt-3">✓ 10 perguntas gratuitas por mês • ✓ Sem cartão de crédito</p>
    </section>
  `
})
export class InicioComponent {

}
