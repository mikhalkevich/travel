let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js')
    .copy('/node_modules/datamaps/dist/datamaps.world.min.js', 'public/plugins/datamaps')
    .copy('//cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min.js', 'public/plugins/datamaps')
    .copy('//cdnjs.cloudflare.com/ajax/libs/topojson/1.6.9/topojson.min.js', 'public/plugins/datamaps');
