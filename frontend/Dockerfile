# ── Stage 1: build ────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Installa dipendenze (layer cache)
COPY package*.json ./
RUN npm ci

# Compila il bundle Vite
COPY . .
RUN npm run build

# ── Stage 2: runtime con nginx ────────────────────────────────────
FROM nginx:alpine AS runtime

# Crea utente non-root
RUN addgroup -g 1001 -S appgroup \
    && adduser -S appuser -u 1001 -G appgroup

# Copia il bundle compilato nella root di nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configurazione nginx personalizzata (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
