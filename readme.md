## NewsParser by country
The main page of the site contains of interactive map with clickable countries. When you switch to a country loads information from the Wiki about this country and loads news of the current day of the selected country. Registered users has the ability to add links by country.
## Need to be finalized
For a perfect news search, each country should have its own google link. You can do it yourself
## Technologies
 - PHP 7.1 and more
 - Nginx or Apache
 - Mysql or MariaDB
 - Laravel
 - Node.js (for chat on socket.io server) 
## Installation information 
 - cd www
 - git clone https://github.com/mikhalkevich/travel
 - cd travel
 - composer self-update
 - composer install
 Create database.
 Next you need to import file world.sql to your database. And connect to your database in file .env.
 Now you are ready to start project
 - php artisan serve
