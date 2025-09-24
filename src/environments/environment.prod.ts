export const environment = {
  production: true,
  configuracao: {
    temperatura: 0.7,
    maxTokens: 4096,
    timeout: 30000,
    provedorPadrao: 'gemini'
  },
  providers: {
    gemini: {
      provedor: 'gemini',
      apiKey: 'SUA_API_KEY_GEMINI_PRODUCAO',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      modelo: 'gemini-1.5-flash'
    },
    chatgpt: {
      provedor: 'chatgpt',
      apiKey: 'SUA_API_KEY_OPENAI_PRODUCAO',
      baseUrl: 'https://api.openai.com/v1',
      modelo: 'gpt-4o-mini'
    }
  }
};
