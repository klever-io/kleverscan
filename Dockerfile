FROM node:22-alpine AS builder
WORKDIR /app

RUN chown node:node /app
COPY --chown=node:node . .
USER node
RUN yarn --frozen-lockfile
RUN yarn build

# Production image, copy all the files and run next
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Where next-i18next reads the translations. Stated absolutely because it
# otherwise resolves them against the server's working directory per request:
# started from anywhere but /app, every namespace loads empty and the site
# renders raw keys ("Titles.Accounts") instead of text.
ENV LOCALES_PATH=/app/public/locales

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