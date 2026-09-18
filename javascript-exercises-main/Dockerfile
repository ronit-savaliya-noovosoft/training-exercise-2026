FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY *.js /usr/share/nginx/html/

COPY fetch_data.js /etc/nginx/templates/fetch_data.js.template