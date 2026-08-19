# Use your exact Node version
FROM node:25-alpine

WORKDIR /app

# Install OpenSSL (Required by Prisma Engine on Alpine)
RUN apk add --no-cache openssl

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and generate the client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the backend codebase
COPY . .