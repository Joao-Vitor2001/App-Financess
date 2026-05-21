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
- Conecte sua conta GitHub e selecione o repositório criado.
- Configure:
  - Branch: `main` (ou `master` se for o caso)
  - Build Command: deixe vazio (para site estático simples)
  - Publish Directory: `frontend`
- Crie o site — o Render irá iniciar um deploy automático.

3. (Opcional) Usar `render.yaml`:
O arquivo `render.yaml` na raiz (gerado aqui) descreve o serviço. Substitua
`https://github.com/YOUR_USER/YOUR_REPO` pelo URL real do seu repositório. Quando
você conectar o repo ao Render, ele detectará o `render.yaml` e criará o serviço automaticamente.

## Dicas
- Se quiser um domínio customizado, adicione em Settings → Custom Domains.
- Para atualizações: commit + push → Render fará novo deploy automático.

Se quiser, eu posso:
- criar o repositório no GitHub e empurrar (push) automaticamente;
- ou gerar um arquivo `.gitignore` e ajustar o `render.yaml` com sua URL.

Diga qual opção prefere e eu prossigo.
