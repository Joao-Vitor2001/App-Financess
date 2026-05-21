# Deploy no Render — PROJETO-TAREFAS (Frontend)

Este projeto contém um frontend estático em `frontend/` (HTML, CSS, JS).
Abaixo estão os passos para publicar o site no Render (https://render.com).

## Passos rápidos

1. Crie um repositório no GitHub e faça push do projeto:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

2. No Render:
- Clique em **New** → **Static Site**.
- Conecte sua conta GitHub e selecione o repositório `Joao-Vitor2001/App-Financess`.
- Configure:
  - Branch: `main`
  - Build Command: deixe vazio
  - Publish Directory: `frontend`
- Crie o site — o Render irá iniciar um deploy automático.

3. (Opcional) Usar `render.yaml`:
O arquivo `render.yaml` na raiz já está configurado com seu repositório `https://github.com/Joao-Vitor2001/App-Financess.git`.
Se o Render ainda criar um Web Service, exclua esse serviço e volte a criar um **Static Site**.

## Dicas
- Se quiser um domínio customizado, adicione em Settings → Custom Domains.
- Para atualizações: commit + push → Render fará novo deploy automático.

## Deploy do backend no Render
Este projeto agora tem duas partes:
- frontend estático em `frontend/`
- backend Node/Express em `backend/`

Se você usar o mesmo repositório no Render, o arquivo `render.yaml` já define:
- `projeto-tarefas-frontend` como Static Site
- `projeto-tarefas-backend` como Web Service Node

Para o backend funcionar no Render:
1. No painel do Render, conecte o repo `Joao-Vitor2001/App-Financess`.
2. Verifique se o serviço `projeto-tarefas-backend` está usando `Node` e `rootDirectory: backend`.
3. Em Settings do serviço backend, adicione a variável de ambiente:
   - `JWT_SECRET` = alguma string segura
4. Salve e faça deploy.

Se quiser, eu posso:
- criar o repositório no GitHub e empurrar (push) automaticamente;
- ou gerar um arquivo `.gitignore` e ajustar o `render.yaml` com sua URL.

Diga qual opção prefere e eu prossigo.

**Backend:**
Adicionei uma proposta de backend em `/backend` com Node/Express, autenticação JWT e banco SQLite. Para rodar localmente veja [backend/README.md](backend/README.md).
