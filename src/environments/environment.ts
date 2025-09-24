export const environment = {
  production: false,
  configuracao: {
    temperatura: 0.7,
    maxTokens: 4096,
    timeout: 30000,
    provedorPadrao: 'gemini'
  },
  providers: {
    gemini: {
      provedor: 'gemini',
      apiKey: 'AIzaSyCv88qDNiY2QkXIrr2cFAW0Boq65XXSzYc',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      modelo: 'gemini-2.5-flash'
    },
    chatgpt: {
      provedor: 'chatgpt',
      apiKey: 'SUA_API_KEY_OPENAI',
      baseUrl: 'https://api.openai.com/v1',
      modelo: 'gpt-4o-mini'
    }
  }
};
