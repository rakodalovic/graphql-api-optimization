# Use nginx to serve the static files
FROM nginx:alpine

# Copy the HTML file to nginx html directory
COPY index.html /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]