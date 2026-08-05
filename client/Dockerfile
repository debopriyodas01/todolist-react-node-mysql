# client/Dockerfile

FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency files first for Docker cache
COPY package*.json ./

# Faster and deterministic install
RUN npm ci

# Copy source
COPY . .

# Build React app
RUN npm run build


# --- Production stage ---
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
