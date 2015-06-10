var concat = require('broccoli-concat')
var uglify = require('broccoli-uglify-js')

var concatenated = concat('src', {
  inputFiles: [
    '*.js'
  ],
  outputFile: '/jquery-commandpalette.min.js',
});

var uglified = uglify(concatenated);
// merge js, css and public file trees, and export them
module.exports = uglified;