# Stage 1: Build the Nuxt application
FROM node:22.14.0-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate static assets for SPA
RUN npm run generate

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

# Copy built assets from the builder stage
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80