import { Injectable, inject } from '@angular/core';
import { IAIProviderPort, PromptEntrada } from '../../application/ports/ai-provider.port';
import { environment } from '../../../environments/environment';
import { GoogleGenAI } from '@google/genai';

@Injectable({ providedIn: 'root' })
export class GeminiProvider implements IAIProviderPort {
  private readonly ai = new GoogleGenAI({ apiKey: environment.providers.gemini.apiKey });

  async gerarConteudo(prompt: PromptEntrada): Promise<string> {
    const resposta = await this.ai.models.generateContent({
      model: prompt?.modelo || environment.providers.gemini.modelo,
      contents: [
        { role: 'user', parts: [{ text: prompt.systemPrompt }] },
        { role: 'user', parts: [{ text: prompt.userPrompt }] }
      ],
      config: {
        temperature: prompt?.temperatura ?? environment.configuracao.temperatura,
        maxOutputTokens: prompt?.maxTokens ?? environment.configuracao.maxTokens
      }
    });
    // SDK moderno expõe .text no response
    // @ts-ignore
    return typeof (resposta as any).text === 'function' ? (resposta as any).text() : ((resposta as any)?.candidates?.[0]?.content?.parts?.[0]?.text ?? '');
  }

  async *gerarConteudoStreaming(prompt: PromptEntrada): AsyncIterable<string> {
    const stream = await this.ai.models.generateContentStream({
      model: prompt?.modelo || environment.providers.gemini.modelo,
      contents: [
        { role: 'user', parts: [{ text: prompt.systemPrompt }] },
        { role: 'user', parts: [{ text: prompt.userPrompt }] }
      ],
      config: {
        temperature: prompt?.temperatura ?? environment.configuracao.temperatura,
        maxOutputTokens: prompt?.maxTokens ?? environment.configuracao.maxTokens
      }
    });

    // for-await chuncks
    for await (const chunk of stream) {
      // @ts-ignore
      const texto = (chunk as any)?.text ?? '';
      if (texto) yield texto as string;
    }
  }
}