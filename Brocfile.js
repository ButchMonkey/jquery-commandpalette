var concat = require('broccoli-concat')
var uglify = require('broccoli-uglify-js')
var cleanCSS = require('broccoli-clean-css');
var mergeTrees = require('broccoli-merge-trees');

var cleanedCSS = cleanCSS('src/css');

var concatenatedJavascript = concat('src', {
  inputFiles: [
    'js/*.js'
  ],
  outputFile: '/jquery-commandpalette.min.js',
});

var uglifiedJavascript = uglify(concatenatedJavascript);

var distTree = mergeTrees([uglifiedJavascript, cleanedCSS]);

// merge js, css and public file trees, and export them
module.exports = distTree;