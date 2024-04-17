FROM cgr.dev/chainguard/node:latest-dev AS base

FROM base AS deps
USER node
WORKDIR /app

COPY --chown=node:node package.json package-lock.json* ./
RUN npm pkg delete scripts.prepare && npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
COPY --chown=node:node .env.local .env.production
RUN npm i sharp
RUN npm run build

FROM cgr.dev/chainguard/node:latest AS runner
WORKDIR /app

ENV NODE_ENV=production

# RUN addgroup -g 1001 -S nextjs
# RUN adduser -S nextjs -u 1001

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME 0.0.0.0

CMD ["server.js"]
