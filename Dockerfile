# Use the official PHP image
FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    nodejs \
    npm \
 && docker-php-ext-install \
    pdo_mysql \
    pdo_pgsql \
    pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

RUN php -m | grep pgsql


# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . .

# Install PHP and Node dependencies
RUN composer install --no-dev --optimize-autoloader
# Explicitly install Node dependencies
RUN npm install

# Build the assets
RUN npm run build
# Set permissions for storage
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
# Expose port 8080 (Render uses this default)
EXPOSE 8080

# Start PHP built-in server (or use Nginx in production)
CMD php artisan serve --host=0.0.0.0 --port=8080