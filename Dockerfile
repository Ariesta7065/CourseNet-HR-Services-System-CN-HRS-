# ===============================
# STAGE 1 — Build dependencies
# ===============================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend source code
COPY . .

# ===============================
# STAGE 2 — Production image
# ===============================
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built app & dependencies from builder stage
COPY --from=builder /app /app

# Expose port for backend API
EXPOSE 5000

# Default environment variable
ENV NODE_ENV=production

# Start the backend service
CMD ["npm", "start"]
