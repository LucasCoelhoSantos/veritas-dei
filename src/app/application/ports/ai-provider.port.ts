import { InjectionToken } from '@angular/core';

export interface PromptEntrada {
  systemPrompt: string;
  userPrompt: string;
  temperatura?: number;
  maxTokens?: number;
  modelo?: string;
}

export interface IAIProviderPort {
  gerarConteudo(prompt: PromptEntrada): Promise<string>;
  gerarConteudoStreaming(prompt: PromptEntrada): AsyncIterable<string>;
}

export const AI_PROVIDER = new InjectionToken<IAIProviderPort>('AI_PROVIDER');
