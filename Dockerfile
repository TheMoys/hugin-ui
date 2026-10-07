# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci

# Copy full application code and build
COPY . .
RUN npm run build

# Stage 2: Serve application with Nginx + SSL
FROM nginx:alpine

# Generate self-signed SSL certificate with SAN for localhost and local IP
RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout /etc/nginx/ssl/server.key \
      -out /etc/nginx/ssl/server.crt \
      -subj "/CN=172.22.101.100" \
      -addext "subjectAltName=IP:172.22.101.100,DNS:localhost,IP:127.0.0.1"

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled dist folder from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
