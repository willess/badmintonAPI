/**
 * Created by Wilco on 05/12/16.
 */
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');


gulp.task('default', function () {
   nodemon({
       script: 'app.js',
       ext: 'js',
       env: {
           PORT: 7000
       },
       ignore: ['./node_modules/**']
   })
   .on('restart', function () {
        console.log('Restarting');
    })
});