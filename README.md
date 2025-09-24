# VeritasDei

## Objetivo

Micro-SaaS PWA IA Católica.

Esse sistema é um chatbot para responder perguntas teológicas sempre com base no católicismo e seus três pilares:
- Sagradas Escrituras
- Tradição
- Magistério

## Como executar (MVP Angular + PWA + Bootstrap)

Pré-requisitos: Node 18+, npm 9+.

1) Instalar dependências
```
cd veritas-dei
npm install
```

2) Rodar em desenvolvimento
```
npm start
```
Acesse http://localhost:4200.

3) Build de produção
```
npm run build
```
Os arquivos ficam em `dist/veritas-dei`.

4) PWA
- Service Worker habilitado automaticamente no build de produção.
- Manifesto e ícones estão em `public/`.

## Estrutura atual
- Páginas: `inicio`, `pagar`, `chat`, `perfil`
- Estilos: somente Bootstrap (`angular.json` inclui `bootstrap.min.css`)
- IA: Integração direta com APIs de IA (Gemini, ChatGPT, Claude)

## Configuração
1. Configure as API keys em `src/environments/environment.ts`
2. Escolha o provedor padrão (Gemini, ChatGPT ou Claude)
3. Ajuste parâmetros como temperatura e maxTokens
4. Veja `CONFIGURACAO_IA.md` para instruções detalhadas

## Próximos passos
- Implementar autenticação e guarda de rotas
- Implementar streaming de respostas em tempo real
- Adicionar cache de respostas para otimização
- Adicionar métricas de uso e monitoramento
