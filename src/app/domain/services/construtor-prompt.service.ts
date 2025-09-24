import { Injectable } from '@angular/core';
import { Pergunta, Referencia, CriarNivelObjeto } from '../models/mensagem.model';

@Injectable({ providedIn: 'root' })
export class ConstrutorPromptService {
  construir(pergunta: Pergunta): { systemPrompt: string; userPrompt: string } {
    const nivel = pergunta.nivelConversacao.nivel;
    const nivelObj = CriarNivelObjeto(nivel);
    const links = pergunta.linksConfiaveis as Referencia[];

    const systemPrompt = [
      'Você é Veritas Dei, um assistente católico especializado em teologia.',
      'Responda sempre com base nos três pilares: Sagradas Escrituras, Tradição e Magistério.',
      `Nível do usuário: ${nivel.toUpperCase()} (${nivelObj?.definicao ?? ''})`,
      'Use apenas as seguintes fontes confiáveis para consulta:',
      ...links.map(link => `- ${link.titulo}: ${link.url}`),
      'Formato da resposta: Markdown, sempre inclua as referências utilizadas ao final.',
      'Mantenha-se fiel ao Magistério e à doutrina católica.'
    ].join('\n');

    return { systemPrompt, userPrompt: pergunta.pergunta };
  }
}