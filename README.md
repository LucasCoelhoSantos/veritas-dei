# VeritasDei

## Objetivo

Micro-SaaS PWA IA Católica.

Esse sistema é um chatbot integrado com n8n para responder perguntas teológicas sempre com base no católicismo e seus três pilares:
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
- Gateway mínimo `N8nGateway` em `src/app/dados/gateways/n8n.gateway.ts`

## Próximos passos
- Adicionar proxy seguro (Cloudflare Worker/Vercel) para n8n
- Implementar autenticação e guarda de rotas
