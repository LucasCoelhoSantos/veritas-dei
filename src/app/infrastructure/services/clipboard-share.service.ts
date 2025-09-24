import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServicoClipboardCompartilhar {
  private temClipboardModerno(): boolean {
    return !!(navigator.clipboard && (window as any).isSecureContext !== false);
  }

  copiarTexto(texto: string): Promise<void> {
    const limpar = this.removerTagsHtml(texto);
    if (this.temClipboardModerno()) {
      return navigator.clipboard.writeText(limpar);
    }
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea');
      textArea.value = limpar;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const sucesso = document.execCommand('copy');
        document.body.removeChild(textArea);
        sucesso ? resolve() : reject();
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    });
  }

  private temWebShare(): boolean {
    return typeof navigator !== 'undefined' && !!(navigator as any).share;
  }

  compartilharTexto(texto: string): Promise<void> {
    const limpar = this.removerTagsHtml(texto);
    if (this.temWebShare()) {
      return (navigator as any).share({
        title: 'IA Católica - Resposta',
        text: limpar,
        url: window.location.href
      });
    }
    const url = `https://wa.me/?text=${encodeURIComponent(limpar + '\n\nFonte: IA Católica - ' + window.location.href)}`;
    window.open(url, '_blank');
    return Promise.resolve();
  }

  private removerTagsHtml(conteudo: string): string {
    return conteudo.replace(/<[^>]*>/g, '');
  }
}