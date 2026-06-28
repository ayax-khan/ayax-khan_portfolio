# Use Node.js 20 Alpine for a smaller footprint
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build the project
RUN pnpm build --no-turbopack

# Final image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install pnpm for runner
RUN npm install -g pnpm

# Copy necessary files from the builder
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/prisma ./prisma

EXPOSE 3000

CMD ["pnpm", "start"]
