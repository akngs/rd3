#!/usr/bin/env phantomjs
require('string.prototype.endswith');

var fs = require('fs'),
    system = require('system');

var inputDir = system.args[1] || fs.workingDirectory;
var outputDir = system.args[2] || fs.workingDirectory;

var page = require('webpage').create();
page.open('rd3.html', renderingLoop);

function renderingLoop() {
  var inputFiles = fs.list(inputDir);
  for(var i = 0; i < inputFiles.length; i++) {
    var inputFile = inputDir + '/' + inputFiles[i];
    if(!inputFile.endsWith('.d3.js')) continue;

    var outputFile =
      outputDir + '/' +
      inputFiles[i].substring(0, inputFiles[i].length - 6) + '.png';

    try {
      render(inputFile, outputFile);
    } catch(e) {
    } finally {
      fs.remove(inputFile);
    }
  }

  setTimeout(renderingLoop, 10);
}

function render(inputFile, outputFile) {
  console.log('Executing ' + inputFile);
  page.evaluate('function() {document.body.innerHTML = "<svg></svg>";}');
  var opt = page.evaluate(fs.read(inputFile));

  console.log('Rendering ' + outputFile);
  page.viewportSize = {width: opt['width'], height: opt['height']};
  page.render(outputFile, {format: 'png'});
}
