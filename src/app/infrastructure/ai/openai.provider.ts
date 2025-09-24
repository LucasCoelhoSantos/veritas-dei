import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IAIProviderPort, PromptEntrada } from '../../application/ports/ai-provider.port';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OpenAIProvider implements IAIProviderPort {
  private readonly http = inject(HttpClient);

  async gerarConteudo(prompt: PromptEntrada): Promise<string> {
    const url = `${environment.providers.chatgpt.baseUrl}/chat/completions`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.providers.chatgpt.apiKey}`
    });
    const body = {
      model: prompt?.modelo || environment.providers.chatgpt.modelo,
      messages: [
        { role: 'system', content: prompt.systemPrompt },
        { role: 'user', content: prompt.userPrompt }
      ],
      temperature: prompt?.temperatura ?? environment.configuracao.temperatura,
      max_tokens: prompt?.maxTokens ?? environment.configuracao.maxTokens
    };

    const resp: any = await firstValueFrom(this.http.post(url, body, { headers }));
    return resp?.choices?.[0]?.message?.content ?? '';
  }

  async *gerarConteudoStreaming(prompt: PromptEntrada): AsyncIterable<string> {
    // Implementação futura. Mantemos compatibilidade com a interface.
    // Pode ser implementado com EventSource/Fetch streaming quando aplicável.
    // Aqui, entregamos em um único chunk como fallback.
    const conteudo = await this.gerarConteudo(prompt);
    yield conteudo;
  }
}