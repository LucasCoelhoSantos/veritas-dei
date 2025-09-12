import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class N8nGateway {
  private readonly webhookUrl = 'https://lucas-coelho.app.n8n.cloud/webhook-test/veritas-dei';

  streamingResposta = signal<string>('');

  constructor(private readonly http: HttpClient) {}

  enviarPergunta(payload: { userId: string; pergunta: string }) {
    return this.http.post<{ id?: string; resposta?: string }>(this.webhookUrl, payload);
  }

  // Placeholder para SSE/polling futuro
}
