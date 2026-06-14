# Simple Reddit Notifier

[Português](#-português) · [English](#-english)

---

## Português

Monitora um feed RSS do Reddit e envia os posts novos via [ntfy](https://ntfy.sh).
Genérico: aponte `REDDIT_URL` para qualquer subreddit ou busca.

## Como funciona

A cada 60s busca o feed (`getFeed.js`), compara com os IDs já vistos
(`oldPosts.json`) e dispara uma notificação por post novo (`sendMessage.js`).

> ⚠️ **Primeiro run:** com o `oldPosts.json` vazio, ele apenas registra os posts
> atuais como vistos — **sem notificar** — pra evitar um flood inicial. As
> notificações começam no ciclo seguinte, só para posts realmente novos. Ou seja:
> um ciclo sem posts novos não imprime nada nem envia nada (é o esperado).

## Setup

```bash
npm install
cp .env.example .env   # preencha as variáveis
npm start              # node --env-file=.env main.js
```

Requer **Node ≥ 20.6** (pelo `--env-file`).

## Variáveis (`.env`)

| Variável | Descrição |
|---|---|
| `NTFY_TOPIC` | Tópico do ntfy. No ntfy.sh ele funciona como senha — mantenha secreto. |
| `REDDIT_USERNAME` | Usado no `User-Agent` da request (sem `/u/`). |
| `REDDIT_URL` | Feed RSS a monitorar (precisa terminar em `.rss`). |

Exemplos de `REDDIT_URL`:

```
https://www.reddit.com/r/SUB/new.rss
https://www.reddit.com/r/SUB/search.rss?q=flair_name:"FLAIR"&restrict_sr=on&sort=new&limit=15
```

## Ajustes

| O quê | Onde |
|---|---|
| Feed monitorado | `REDDIT_URL` no `.env` |
| Frequência do poll | `setInterval(tick, 60_000)` em `main.js` |
| Throttle entre envios | `setTimeout(r, 5000)` em `main.js` |
| Prioridade / título | `sendMessage.js` |

## Rate limit (ntfy)

O ntfy.sh limita ~1 msg / 5s por IP. Já tratado: seed no primeiro run, throttle
de 5s entre envios e retry no 429 (o post não é marcado e reentra no próximo ciclo).

---

## English

Monitors a Reddit RSS feed and pushes new posts via [ntfy](https://ntfy.sh).
Generic: point `REDDIT_URL` at any subreddit or search.

### How it works

Every 60s it fetches the feed (`getFeed.js`), diffs against the seen IDs
(`oldPosts.json`) and fires one notification per new post (`sendMessage.js`).

> ⚠️ **First run:** with an empty `oldPosts.json`, it just records the current
> posts as seen — **without notifying** — to avoid an initial flood. Notifications
> start on the next cycle, only for genuinely new posts. So a cycle with no new
> posts prints nothing and sends nothing (this is expected).

### Setup

```bash
npm install
cp .env.example .env   # fill in the variables
npm start              # node --env-file=.env main.js
```

Requires **Node ≥ 20.6** (for `--env-file`).

### Variables (`.env`)

| Variable | Description |
|---|---|
| `NTFY_TOPIC` | ntfy topic. On ntfy.sh it acts as a password — keep it secret. |
| `REDDIT_USERNAME` | Used in the request `User-Agent` (no `/u/`). |
| `REDDIT_URL` | RSS feed to monitor (must end in `.rss`). |

`REDDIT_URL` examples:

```
https://www.reddit.com/r/SUB/new.rss
https://www.reddit.com/r/SUB/search.rss?q=flair_name:"FLAIR"&restrict_sr=on&sort=new&limit=15
```

### Tweaks

| What | Where |
|---|---|
| Monitored feed | `REDDIT_URL` in `.env` |
| Poll frequency | `setInterval(tick, 60_000)` in `main.js` |
| Throttle between sends | `setTimeout(r, 5000)` in `main.js` |
| Priority / title | `sendMessage.js` |

### Rate limit (ntfy)

ntfy.sh caps ~1 msg / 5s per IP. Already handled: seed on first run, 5s throttle
between sends, and retry on 429 (the post isn't marked and re-enters next cycle).
