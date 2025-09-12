import { Component } from '@angular/core';

@Component({
  selector: 'app-pagar',
  standalone: true,
  imports: [],
  template: `
    <section class="py-5 bg-body-tertiary">
      <h1 class="display-5 fw-bold text-center mb-1">
        Escolha seu Plano de <span class="text-primary">Crescimento na Fé</span>
      </h1>
      <p class="text-center text-secondary mb-5">Invista em sua formação católica com segurança doutrinária</p>

      <div class="row g-4 align-items-stretch justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card pricing-card h-100 shadow-sm border-0">
            <div class="card-body d-flex flex-column">
              <div class="text-center mb-3">
                <div class="icon-circle bg-secondary-subtle text-secondary">
                  <i class="bi bi-flag"></i>
                </div>
              </div>
              <h3 class="h4 text-center mb-1">Gratuito</h3>
              <p class="text-center text-secondary small mb-3">Para começar sua jornada</p>
              <div class="text-center mb-3">
                <span class="preco display-6 fw-bold">R$ 0</span>
              </div>
              <ul class="list-unstyled mt-2 small flex-grow-1">
                <li class="d-flex align-items-start gap-2 mb-2">
                  <i class="bi bi-check2-circle text-success"></i>
                  <span>10 perguntas por mês</span>
                </li>
                <li class="d-flex align-items-start gap-2 mb-2">
                  <i class="bi bi-check2-circle text-success"></i>
                  <span>Respostas com citações</span>
                </li>
                <li class="d-flex align-items-start gap-2 mb-2">
                  <i class="bi bi-check2-circle text-success"></i>
                  <span>Modo catequese básico</span>
                </li>
                <li class="d-flex align-items-start gap-2">
                  <i class="bi bi-check2-circle text-success"></i>
                  <span>Acesso via navegador</span>
                </li>
              </ul>
              <div class="d-grid mt-3">
                <button class="btn btn-outline-secondary">Começar Grátis</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-4">
          <div class="position-relative h-100">
            <div class="popular-badge">Mais Popular</div>
            <div class="card pricing-card h-100 shadow border-warning border-2 highlight">
              <div class="card-body d-flex flex-column">
                <div class="text-center mb-3">
                  <div class="icon-circle bg-warning text-dark">
                    <i class="bi bi-stars"></i>
                  </div>
                </div>
                <h3 class="h4 text-center mb-1">Fiel</h3>
                <p class="text-center text-secondary small mb-3">Para aprofundar na fé</p>
                <div class="text-center mb-3">
                  <span class="preco display-6 fw-bold">R$ 19,90</span>
                  <small class="text-secondary">/mês</small>
                </div>
                <ul class="list-unstyled mt-2 small flex-grow-1">
                  <li class="d-flex align-items-start gap-2 mb-2">
                    <i class="bi bi-check2-circle text-success"></i>
                    <span>Perguntas ilimitadas</span>
                  </li>
                  <li class="d-flex align-items-start gap-2 mb-2">
                    <i class="bi bi-check2-circle text-success"></i>
                    <span>Histórico de conversas</span>
                  </li>
                  <li class="d-flex align-items-start gap-2 mb-2">
                    <i class="bi bi-check2-circle text-success"></i>
                    <span>Modo catequese completo</span>
                  </li>
                  <li class="d-flex align-items-start gap-2 mb-2">
                    <i class="bi bi-check2-circle text-success"></i>
                    <span>App móvel (PWA)</span>
                  </li>
                  <li class="d-flex align-items-start gap-2">
                    <i class="bi bi-check2-circle text-success"></i>
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <div class="d-grid mt-3">
                  <button class="btn btn-warning text-dark fw-semibold">Assinar Agora</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-4">
          <div class="card pricing-card h-100 shadow-sm border-0">
            <div class="card-body d-flex flex-column">
              <div class="text-center mb-3">
                <div class="icon-circle bg-primary-subtle text-primary">
                  <i class="bi bi-mortarboard"></i>
                </div>
              </div>
              <h3 class="h4 text-center mb-1">Estudioso</h3>
              <p class="text-center text-secondary small mb-3">Para estudantes de teologia</p>
              <div class="text-center mb-3">
                <span class="preco display-6 fw-bold">R$ 39,90</span>
                <small class="text-secondary">/mês</small>
              </div>
              <ul class="list-unstyled mt-2 small flex-grow-1">
                <li class="d-flex align-items-start gap-2 mb-2">
                  <i class="bi bi-check2-circle text-success"></i>
                  <span>Tudo do plano Fiel</span>
                </li>
                <li class="d-flex align-items-start gap-2 mb-2">
                  <i class="bi bi-check2-circle text-success"></i>
                  <span>Busca avançada</span>
                </li>
                <li class="d-flex align-items-start gap-2 mb-2">
                  <i class="bi bi-check2-circle text-success"></i>
                  <span>Catequese personalizada</span>
                </li>
                <li class="d-flex align-items-start gap-2 mb-2">
                  <i class="bi bi-check2-circle text-success"></i>
                  <span>Encíclicas completas</span>
                </li>
                <li class="d-flex align-items-start gap-2">
                  <i class="bi bi-check2-circle text-success"></i>
                  <span>Exportação de respostas</span>
                </li>
              </ul>
              <div class="d-grid mt-3">
                <button class="btn btn-primary">Começar Premium</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="text-center text-secondary small mt-4 d-flex justify-content-center gap-3 flex-wrap">
        <span class="d-inline-flex align-items-center gap-2"><i class="bi bi-check2-circle"></i> Cancele quando quiser</span>
        <span class="d-inline-flex align-items-center gap-2"><i class="bi bi-check2-circle"></i> Sem taxas ocultas</span>
        <span class="d-inline-flex align-items-center gap-2"><i class="bi bi-check2-circle"></i> Pagamento seguro</span>
      </p>
    </section>
  `,
  styles: `
    .pricing-card { border-radius: 16px; transition: transform .2s ease, box-shadow .2s ease; }
    .pricing-card:hover { transform: translateY(-2px); box-shadow: 0 .75rem 1.5rem rgba(0,0,0,.08); }
    .pricing-card.highlight { background: #fff; }
    .icon-circle { width: 56px; height: 56px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .popular-badge { position: absolute; left: 50%; transform: translateX(-50%); top: -14px; background: var(--bs-warning-bg-subtle); color: var(--bs-warning-text-emphasis); border: 1px solid var(--bs-warning-border-subtle); padding: .35rem .75rem; border-radius: 999px; font-weight: 600; font-size: .85rem; z-index: 2; }
    .preco { letter-spacing: -0.5px; }
  `
})
export class PagarComponent {

}
