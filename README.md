# Gaius Web

Frontend web do **Gaius** — plataforma de investimentos com dashboard de mercado, autenticação de usuários e calculadoras financeiras. A interface é em português (pt-BR) e consome uma API REST externa (backend separado deste repositório).

## O que o projeto faz

| Área | Descrição |
|------|-----------|
| **Dashboard** (`/home`) | Mockup visual com cotações em destaque, notícias, rankings, Ibovespa, planos de assinatura e categorias de ativos. A maior parte dos dados vem de mocks locais (`utils/mock-*.ts`). |
| **Autenticação** | Login (`/login`) e cadastro (`/register`) via `POST /auth/login` e `POST /auth/register`. O token JWT fica no `localStorage` e é enviado como `Authorization: Bearer`. |
| **Perfil** | Com usuário logado, o app chama `GET /users/me` para exibir nome e e-mail na barra superior. |
| **Ativos (API)** | O hook `useAssets` busca `GET /assets` e faz fallback para simulação se a API falhar (hoje não está ligado ao dashboard principal, que usa mocks). |
| **Calculadora** | Página `/home/calculadora` (juros compostos, simples, primeiro milhão, porcentagens, reserva de emergência, CDI) e calculadora flutuante global (estilo Windows). |
| **Tema** | Modo claro/escuro persistido no navegador. |

A rota raiz (`/`) redireciona automaticamente para `/home`.

## Stack técnica

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Material UI (MUI)](https://mui.com) 7 + Emotion
- [Tailwind CSS](https://tailwindcss.com) 4 (PostCSS)
- [Axios](https://axios-http.com) para HTTP
- [Recharts](https://recharts.org) (gráficos onde aplicável)
- Gerenciador de pacotes: **pnpm**

> Este projeto usa uma versão recente do Next.js com APIs que podem diferir da documentação clássica. Em dúvida, consulte `node_modules/next/dist/docs/`.

## Estrutura de pastas

```
gaius-web/
├── app/                    # Rotas (App Router)
│   ├── page.tsx            # Redireciona para /home
│   ├── home/               # Dashboard e calculadora
│   ├── login/
│   └── register/
├── components/             # UI (auth, dashboard, calculadora, providers)
├── hooks/                  # useAuth, useProfile, useAssets
├── lib/                    # Cliente HTTP, APIs, tema, fórmulas da calculadora
├── types/                  # Tipos TypeScript (contratos da API)
├── utils/                  # Validação, storage, dados mock
└── public/                 # Assets estáticos
```

Alias de import: `@/*` aponta para a raiz do projeto (ver `tsconfig.json`).

## Pré-requisitos

1. **Node.js** 20 ou superior (recomendado LTS).
2. **pnpm** instalado globalmente:
   ```bash
   npm install -g pnpm
   ```
3. **(Opcional, mas recomendado para login/cadastro)** API backend do Gaius rodando e acessível, com os endpoints descritos na seção [Integração com a API](#integração-com-a-api).

## Passo a passo — rodar localmente

### 1. Clonar e entrar no projeto

```bash
git clone <url-do-repositorio>
cd gaius-web
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Há um modelo versionado em [`.env.example`](.env.example). Copie para `.env.local` (não vai para o Git):

```bash
cp .env.example .env.local
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env.local
```

**Opção A — Proxy do Next (recomendado em desenvolvimento, evita CORS)**

O front chama `/api/proxy/...` e o Next encaminha para o backend definido em `API_ORIGIN`:

```env
# Porta em que o Next sobe (pnpm dev). Ex.: 3001 se a API usar 3000.
# Não defina NEXT_PUBLIC_API_URL — o padrão é /api/proxy

API_ORIGIN=http://localhost:3000
```

**Opção B — API direta no browser**

O front chama o backend na URL pública. O servidor precisa liberar **CORS** para a origem do front (ex.: `http://localhost:3001`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
API_ORIGIN=http://localhost:3000
```

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `API_ORIGIN` | Não (padrão: `http://localhost:3000`) | URL base do backend usada pelo **rewrite** em `next.config.ts` (`/api/proxy/*` → backend). |
| `NEXT_PUBLIC_API_URL` | Não | Se definida, o Axios usa essa URL em vez do proxy. Útil quando o backend já expõe CORS. |

**Portas comuns:** API na `3000`, front na `3001`:

```bash
pnpm dev -- -p 3001
```

Sempre **reinicie** o `pnpm dev` após alterar `.env.local`.

### 4. Subir o servidor de desenvolvimento

```bash
pnpm dev
```

Abra no navegador:

- Com porta padrão: [http://localhost:3000](http://localhost:3000)
- Com `-p 3001`: [http://localhost:3001](http://localhost:3001)

### 5. Validar o fluxo

1. Acesse `/home` — o dashboard deve carregar (dados ilustrativos/mock).
2. Acesse `/register`, crie uma conta (requer API no ar).
3. Acesse `/login` e entre com o mesmo e-mail/senha.
4. Na barra superior, confira se nome/e-mail aparecem (`/users/me`).
5. Abra **Calculadora** no menu ou `/home/calculadora`; use o botão flutuante da calculadora em qualquer página.

### 6. Build de produção (opcional)

```bash
pnpm build
pnpm start
```

O comando `start` serve o build otimizado (porta padrão 3000, salvo configuração do ambiente).

## Scripts disponíveis

| Comando | Função |
|---------|--------|
| `pnpm dev` | Servidor de desenvolvimento com hot reload |
| `pnpm build` | Gera build de produção |
| `pnpm start` | Sobe o app em modo produção (após `build`) |
| `pnpm lint` | Executa ESLint |

## Integração com a API

O cliente HTTP está em `lib/api-client.ts`. Endpoints esperados:

| Método | Rota | Uso |
|--------|------|-----|
| `POST` | `/auth/login` | Login — resposta com `accessToken`, `access_token` ou `token` |
| `POST` | `/auth/register` | Cadastro (`name`, `email`, `password`) |
| `GET` | `/users/me` | Perfil do usuário autenticado |
| `GET` | `/assets` | Lista de ativos (fallback simulado em `useAssets` se falhar) |

Em respostas `401`, o token local é removido automaticamente.

### Proxy e CORS

```text
Browser  →  GET /api/proxy/users/me
Next.js  →  rewrite  →  GET {API_ORIGIN}/users/me
```

Se aparecer *"Network Error"* ou mensagem sobre CORS no login:

1. Confirme que o backend está rodando em `API_ORIGIN`.
2. Revise `.env.local` e reinicie o dev server.
3. Se usar `NEXT_PUBLIC_API_URL` apontando para outra porta, configure CORS no backend para a origem do front.

## Rotas principais

| Rota | Página |
|------|--------|
| `/` | Redireciona para `/home` |
| `/home` | Dashboard de investimentos |
| `/home/calculadora` | Calculadora avançada |
| `/login` | Entrar |
| `/register` | Criar conta |

## Autenticação no navegador

- Chave do token: `gaius_auth_token` (`utils/storage.ts`).
- Modo do tema: `gaius-mode` (`lib/app-theme.ts`).

Para “sair”, use o botão na AppBar; isso limpa o token e mantém você na home como visitante.

## Dados mock vs API real

- O **dashboard** (`HomeContent`) usa principalmente dados fixos de `utils/mock-dashboard-data.ts`, `mock-ibovespa.ts`, etc. O rodapé indica que é mockup visual.
- **Login, cadastro e perfil** dependem da API real.
- **`useAssets`** está pronto para API, mas ainda não alimenta as seções do dashboard atual.

## Solução de problemas

| Problema | O que verificar |
|----------|-----------------|
| Login falha com erro de rede | Backend ligado? `API_ORIGIN` / `NEXT_PUBLIC_API_URL` corretos? Reiniciou o `pnpm dev`? |
| Porta 3000 em uso | Rode o front em outra porta: `pnpm dev -- -p 3001` e ajuste CORS/proxy. |
| Token some após refresh | Resposta 401 da API — token inválido ou expirado. |
| Imagens externas não carregam | Domínios permitidos em `next.config.ts` (`coingecko`, `clearbit`, etc.). |
| Erros de dependências | Apague `node_modules`, rode `pnpm install` de novo. |

## Licença e contribuição

Projeto privado (`"private": true` no `package.json`). Para contribuir, abra PRs no repositório da equipe Gaius seguindo o fluxo de revisão interno.

---

**Gaius** — dashboard de investimentos e mercado. Dúvidas sobre o backend ou contratos da API devem ser alinhadas com o time responsável pela API do ecossistema Gaius.
