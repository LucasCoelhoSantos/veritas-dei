import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Pergunta, Resposta } from '../../domain/models/mensagem.model';
import { ConstrutorPromptService } from '../../domain/services/construtor-prompt.service';
import { ExtratorReferenciasService } from '../../domain/services/extrator-referencias.service';
import { AI_PROVIDER } from '../ports/ai-provider.port';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnviarPerguntaUseCase {
  private readonly provedorIA = inject(AI_PROVIDER);
  private readonly construtorPrompt = inject(ConstrutorPromptService);
  private readonly extratorReferencias = inject(ExtratorReferenciasService);

  streamingResposta = signal<string>('');
  isStreaming = signal<boolean>(false);

  executar(pergunta: Pergunta): Promise<Resposta> {
    const prompt = this.construtorPrompt.construir(pergunta);
    return this.provedorIA.gerarConteudo({
      ...prompt,
      modelo: this.obterModeloAtivo(),
      temperatura: environment.configuracao.temperatura,
      maxTokens: environment.configuracao.maxTokens
    }).then(texto => this.montarResposta(texto, pergunta));
  }

  executarStreaming(pergunta: Pergunta): Observable<string> {
    const prompt = this.construtorPrompt.construir(pergunta);
    const iterator = this.provedorIA.gerarConteudoStreaming({
      ...prompt,
      modelo: this.obterModeloAtivo(),
      temperatura: environment.configuracao.temperatura,
      maxTokens: environment.configuracao.maxTokens
    });

    this.isStreaming.set(true);
    this.streamingResposta.set('');

    return new Observable<string>((observer) => {
      (async () => {
        try {
          for await (const chunk of iterator) {
            this.streamingResposta.update(atual => atual + chunk);
            observer.next(chunk);
          }
          observer.complete();
        } catch (erro) {
          observer.error(erro);
        } finally {
          this.isStreaming.set(false);
        }
      })();
    });
  }

  private obterModeloAtivo(): string {
    const provedorPadrao = environment.configuracao.provedorPadrao;
    return provedorPadrao === 'chatgpt' ? environment.providers.chatgpt.modelo : environment.providers.gemini.modelo;
  }

  private montarResposta(texto: string, pergunta: Pergunta): Resposta {
    const resposta = typeof texto === 'string' && texto ? texto : 'Resposta não disponível';
    const referencias = this.extratorReferencias.extrair(resposta, pergunta.linksConfiaveis);
    return {
      resposta,
      referencias,
      fontesConsultadas: pergunta.linksConfiaveis.map(l => l.titulo)
    };
  }
}