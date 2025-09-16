FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Don't build in development
EXPOSE 3000

# Use start:dev for hot reload
CMD ["npm", "run", "start:dev"]