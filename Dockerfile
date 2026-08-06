FROM node:22-alpine AS builder
WORKDIR /app

COPY . .
RUN yarn --frozen-lockfile
RUN yarn build

# Production image, copy all the files and run next
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next-i18next.config.js ./

USER nextjs
EXPOSE 3000

CMD ["yarn", "start"]