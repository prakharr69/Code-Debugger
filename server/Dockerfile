FROM node:20-alpine

WORKDIR /app

# Copy server package files
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "index.js"]
