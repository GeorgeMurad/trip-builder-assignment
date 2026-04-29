FROM php:8.2-cli

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    unzip \
    curl \
    git \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ✅ COPY ONLY BACKEND
COPY trip-builder/ .

RUN composer install --no-dev --optimize-autoloader

# ✅ create DB + migrate
RUN touch database/database.sqlite && php artisan migrate --force

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000