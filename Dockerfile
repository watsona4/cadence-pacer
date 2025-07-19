# Use nginx as the base image
FROM nginx:alpine

# Copy custom content into nginx's default html directory
COPY . /usr/share/nginx/html

# Expose nginx's default port
EXPOSE 80
