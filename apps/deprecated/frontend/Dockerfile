# Use Node.js as base image
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install -g pnpm

# Install dependencies
RUN pnpm install 

# Copy app source code
COPY . .

# Build the app
RUN pnpm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy build files from previous stage

COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80 
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]