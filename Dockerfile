FROM node:18-alpine as build

WORKDIR /app

# Accept VITE_API_URL as a build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .

# Using bun would be faster, but the user requested npm-style based on their model
# We'll stick to the user's requested structure but ensure it works with the project
RUN npm install
RUN npm run build

FROM nginx:alpine

# Custom nginx config to handle SPA routing (important for React/TanStack Router)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
