FROM php:8.2-cli

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    unzip \
    curl \
    git \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ✅ COPY ONLY backend folder
COPY trip-builder/ .

RUN composer install --no-dev --optimize-autoloader

# ✅ ONLY create sqlite file (NO migrate here)
RUN mkdir -p database && touch database/database.sqlite

EXPOSE 10000

CMD sh -c "php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=10000"