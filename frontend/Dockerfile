# Stage 1: Build the React/Vite app
FROM node:25-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# --> ADD THIS LINE to replace the default Nginx config:
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built React app
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]