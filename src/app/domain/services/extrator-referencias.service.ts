import { Injectable } from '@angular/core';
import { Referencia } from '../models/mensagem.model';

@Injectable({ providedIn: 'root' })
export class ExtratorReferenciasService {
  extrair(conteudo: string, linksConfiaveis: Referencia[]): (string | Referencia)[] {
    const referencias: (string | Referencia)[] = [];

    try {
      linksConfiaveis.forEach(link => {
        if ((conteudo || '').toLowerCase().includes(link.titulo.toLowerCase())) {
          referencias.push({ titulo: link.titulo, url: link.url });
        }
      });

      const citacoesBiblicas = (conteudo || '').match(/([A-Za-zÀ-ú]+\s+\d+:\d+)/g);
      if (citacoesBiblicas) referencias.push(...citacoesBiblicas);
    } catch {
      // silencioso: retorno vazio é aceitável
    }

    return referencias;
  }
}