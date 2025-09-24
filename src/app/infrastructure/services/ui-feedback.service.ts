import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServicoUIFeedback {
  mostrarToast(mensagem: string, tipo: 'success' | 'error' = 'success'): void {
    const toast = document.createElement('div');
    toast.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.textContent = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }

  abrirModalPorId(id: string): void {
    const modalElement = document.getElementById(id);
    if (!modalElement) return;
    const bootstrap = (window as any).bootstrap;
    const modal = bootstrap?.Modal?.getOrCreateInstance ? bootstrap.Modal.getOrCreateInstance(modalElement) : null;
    if (modal) {
      modal.show();
      return;
    }
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    modalElement.setAttribute('aria-hidden', 'false');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.id = 'modalBackdrop';
    document.body.appendChild(backdrop);
    document.body.classList.add('modal-open');
  }

  fecharModalPorId(id: string): void {
    const modalElement = document.getElementById(id);
    if (!modalElement) return;
    const bootstrap = (window as any).bootstrap;
    const modal = bootstrap?.Modal?.getInstance ? bootstrap.Modal.getInstance(modalElement) : null;
    if (modal) {
      modal.hide();
      return;
    }
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
    const backdrop = document.getElementById('modalBackdrop');
    if (backdrop) {
      document.body.removeChild(backdrop);
    }
    document.body.classList.remove('modal-open');
  }
}