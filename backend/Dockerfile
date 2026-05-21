FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run build
RUN npm run db:generate

# ---- Imagem final (menor) ----
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev
RUN npm run db:generate

COPY --from=builder /app/dist ./dist

EXPOSE 3333

CMD ["npm", "run", "start"]