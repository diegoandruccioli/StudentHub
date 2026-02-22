# ── Stage 1: compile ──────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Installa prima le dipendenze (sfrutta la cache dei layer Docker)
COPY package*.json ./
RUN npm ci

# Compila TypeScript → JavaScript
COPY . .
RUN npm run build

# ── Stage 2: runtime ──────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Crea utente non-root per sicurezza
RUN addgroup -g 1001 -S appgroup \
    && adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Installa solo production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copia solo i file compilati dallo stage builder
COPY --from=builder /app/dist ./dist

# Passa all'utente non privilegiato
USER appuser

EXPOSE 3000

# Healthcheck integrato (Docker Compose lo usa già, qui agiunge il fallback)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

# Esegue il JS compilato (non ts-node, non devDependencies necessarie)
CMD ["node", "dist/server.js"]
