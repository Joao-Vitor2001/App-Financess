# Backend (Node/Express) — App-Financess

Este backend mínimo fornece autenticação JWT e endpoints para gerenciar finanças.

Como usar (local):

1. Instale dependências:

```bash
cd backend
npm install
```

2. Opcional: copie `.env.example` para `.env` e ajuste `JWT_SECRET`.

3. Rodar em desenvolvimento:

```bash
npm run dev
```

Endpoints principais:
- `POST /auth/register` { username, password }
- `POST /auth/login` { username, password }
- `GET /finances` (Authorization: Bearer <token>)
- `POST /finances` (Authorization: Bearer <token>)

Para deploy no Render: crie um Web Service (Node) apontando a raiz `backend` ou use `render.yaml` para criar o serviço. Configure `DATABASE_URL` se usar Postgres em vez do SQLite local.
