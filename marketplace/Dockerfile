FROM node:lts AS dependencies
WORKDIR /app-1
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts AS builder
WORKDIR /app-1
COPY . .
COPY --from=dependencies /app-1/node_modules ./node_modules
RUN yarn build

FROM node:lts AS runner
WORKDIR /app-1
ENV NODE_ENV=production

COPY --from=builder /app-1/const ./const
COPY --from=builder /app-1/components_new ./components_new
COPY --from=builder /app-1/pages ./pages
COPY --from=builder /app-1/public ./public
COPY --from=builder /app-1/styles ./styles
COPY --from=builder /app-1/package.json ./package.json
COPY --from=builder /app-1/.next ./.next
COPY --from=builder /app-1/node_modules ./node_modules
COPY --from=builder /app-1/charityNFTAbi.json ./charityNFTAbi.json

EXPOSE 3000
CMD ["yarn", "start"]