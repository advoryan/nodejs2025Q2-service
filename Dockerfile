# syntax=docker/dockerfile:1.6
ARG NODE_VERSION=24.10.0

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npm run build

FROM node:${NODE_VERSION}-alpine AS production
ENV NODE_ENV=production
ENV PORT=4000
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/main.js"]
