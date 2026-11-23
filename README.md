# Amigo Secreto da Família 🎁

Sorteio de amigo secreto feito em Next.js, com os participantes cadastrados no Contentful.
Cada pessoa recebe pelo WhatsApp um link secreto que mostra só quem *ela* tirou.

## Como funciona

1. Cadastre e **publique** as pessoas no Contentful (tipo de conteúdo `people`).
2. Entre em `/draw` com a senha do organizador e clique em **Fazer sorteio**.
3. Para cada pessoa, clique em **WhatsApp**. O WhatsApp abre com a mensagem e o link prontos. A lista marca quem já recebeu (só no seu navegador).
4. A pessoa abre o link e clica para revelar o nome.

A página pública `/presentes` mostra o que cada um pediu (só nomes e listas de desejos, nunca quem tirou quem).

O sorteio embaralha a lista e forma uma roda (cada um tira o próximo). Por isso ninguém tira a si mesmo e o sorteio nunca trava.
Nem o organizador vê o resultado: a área do organizador e a API nunca mostram quem tirou quem.

Os links são fixos para cada pessoa, mesmo que o sorteio seja refeito. Se precisar refazer, não é preciso mandar os links de novo.

## Contentful

Tipo de conteúdo `people` com os campos:

| Campo    | Tipo                        | Obrigatório |
|----------|-----------------------------|-------------|
| `name`   | Short text                  | sim         |
| `caught` | Reference (uma entrada `people`) | sim (preenchido pelo sorteio) |
| `phone`  | Short text, ex.: `+55 11 99999-0000` | não. Se existir, o botão do WhatsApp já abre a conversa certa |

## Variáveis de ambiente

Veja `.env.example`. Para rodar localmente, copie para `.env.local`. Na Vercel, cadastre as mesmas variáveis em *Settings → Environment Variables*.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.
