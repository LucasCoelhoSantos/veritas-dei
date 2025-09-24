import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServicoArmazenamento {
  private readonly prefixo: string = 'veritas-dei';

  private montarChave(chave: string): string {
    // Compatibilidade: se a chave já vier namespaced no padrão antigo, não prefixar novamente
    if (chave.startsWith('veritas-dei-')) {
      return chave;
    }
    return `${this.prefixo}:${chave}`;
  }

  obter<T>(chave: string, valorPadrao: T | null = null): T | null {
    try {
      const bruta = localStorage.getItem(this.montarChave(chave));
      if (bruta == null) return valorPadrao;
      return JSON.parse(bruta) as T;
    } catch {
      return valorPadrao;
    }
  }

  salvar<T>(chave: string, valor: T): void {
    try {
      localStorage.setItem(this.montarChave(chave), JSON.stringify(valor));
    } catch {}
  }

  remover(chave: string): void {
    try {
      localStorage.removeItem(this.montarChave(chave));
    } catch {}
  }

  obterNumero(chave: string, padrao = 0): number {
    const v = this.obter<number | string>(chave, padrao);
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    return Number.isFinite(n as number) ? (n as number) : padrao;
  }

  salvarNumero(chave: string, valor: number): void {
    this.salvar<number>(chave, valor);
  }
}