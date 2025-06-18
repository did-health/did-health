# Stage 1: Build Vite app with node 20
FROM node:20.18.0-bookworm AS builder

WORKDIR /app

# Install dependencies for native modules and Yarn
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  curl \
  && corepack enable \
  && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY package.json yarn.lock ./
#RUN yarn install --frozen-lockfile
RUN yarn install
# Copy source and build
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" yarn build

# Stage 2: Serve with nginx
FROM nginx:1.25-alpine

# Replace default config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built site from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
