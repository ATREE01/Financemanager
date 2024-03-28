# This is my finance manage app made by react and express

## How to deploy 

### Deploy for development 

1. Using Docker Desktop to run the docker-compose.yaml in the backend folder and then connect to localhost:8080, use the schema.sql to create tables in the database.
<br/>

2. Make a .env file and make sure the format is the same as .env.example and the parameter of database must be the same with that in docker-compose.yaml.
<br/>

3. You can either use the command `pnpm run dev` in the root folder to run both the frontend and backend or go to backend folder and run `pnpm start` and go to frontend folder and run `pnpm run dev`.

### Deploy for test in docker in local

1. Set the `host` in .env file to database

2. Chnage the setting in `./apps/frontend/nginx/nginx.conf` to 
```
server {
    listen 80;
    listen [::]:80;

    server_name localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000/api;
    }
}
```
3. Compose up the `docker-compose.yml` in root folder.

### Deploy for production
2. Make a .env file and make sure the format is the same as .env.example and the parameter of database must be the same with that in docker-compose.yaml.

1. Chnage the setting in `./apps/frontend/nginx/nginx.conf` to the following.
Rememeber to change the domain name. 

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name "your domain";

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000/api;
    }
}
```

2. Compose up the docker-compose.yml in root folder.

3. Execute the following command
```bash
docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d "your domain"
```
you can set the following comand as a routine so that the website can renew the certificate automatically. 
```bash
docker compose run --rm certbot renew
```


4. After the certbot told you that you successfully get certificatechange the setting in `./apps/frontend/nginx/nginx.conf` to the following and then restart the `docker-compose.yml`.
```nginx
server {
    listen 80;
    listen [::]:80;

    server_name "your domain";

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https:/"your domain"$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name "your domain";

    ssl_certificate /etc/letsencrypt/live/"your domain"/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/"your domain"/privkey.pem;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000/api;
    }
}

```

5. The website should be deploy successfully.
