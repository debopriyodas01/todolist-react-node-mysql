# client/Dockerfile
FROM node:22-alpine AS build

WORKDIR /app

# 1. Copy ONLY dependency manifest definitions first
COPY package*.json ./

# 2. This step is now cached natively. It will only re-run if package.json changes!
RUN npm install

# 3. Copy the remaining source files AFTER dependencies are installed
COPY . .

RUN npm run build

# --- STAGE 2: PRODUCTION WEBSERVER ---
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
