FROM php:5.5-apache

RUN apt-get update && apt-get -y upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install \
    unzip libfreetype6-dev libjpeg62-turbo-dev libmcrypt-dev libpng12-dev

ADD https://github.com/skywalker512/FlarumChina/archive/master.zip /flarum.zip
RUN unzip /flarum.zip -d /var/www/html && \
    cp -r /var/www/html/FlarumChina-master/* /var/www/html && \
    rm -rf /var/www/html/FlarumChina-master && \
    chown -R www-data:www-data /var/www/html

RUN a2enmod rewrite && \
    docker-php-ext-install iconv mcrypt && \
    docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ && \
    docker-php-ext-install gd

RUN docker-php-ext-install mbstring pdo_mysql

ADD .htaccess /var/www/html/.htaccess
