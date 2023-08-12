# Build Image
FROM node:18.16-bullseye-slim AS DEPENDENCIES
LABEL author="Bruno Barros bruno.barros@nka.pt"

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./

RUN yarn

# Build Builder
FROM node:18.16-bullseye-slim AS BUILDER
LABEL author="Bruno Barros bruno.barros@nka.pt"

WORKDIR /usr/src/app
COPY --from=DEPENDENCIES /usr/src/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV production
RUN yarn build

#Build production
FROM node:18.16-bullseye-slim AS PRODUCTION
LABEL author="Bruno Barros bruno.barros@nka.pt"

WORKDIR /usr/src/app

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

COPY --from=BUILDER /usr/src/app/.next/standalone ./standalone
COPY --from=BUILDER /usr/src/app/public /usr/src/app/standalone/public
COPY --from=BUILDER /usr/src/app/.next/static /usr/src/app/standalone/.next/static

EXPOSE 3001
ENV PORT 3001
CMD ["node", "./standalone/server.js"]
