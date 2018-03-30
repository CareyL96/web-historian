var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.sendResponse = (response, obj, statusCode = 200) => {
  response.writeHead(statusCode, exports.headers);
  response.end(obj);
}

exports.collectData = (request, callback) => {
  var data = '';
  request.on('data', chunk => data += chunk);
  request.on('end', () => callback(data));
}

exports.send404 = function(response) {
  exports.sendResponse(response, '404: Page not found', 404);
}

exports.serveAssets = function(response, asset, callback)  {
  var encoding = {encoding: 'utf8'};
  fs.readFile( archive.paths.siteAssets + asset, encoding, function(err, data) {
    if (err) {
      // file doesn't exist in public!
      fs.readFile( archive.paths.archivedSites + asset, encoding, function(err, data) {
        if (err) {
          // file doesn't exist in archive!
          callback ? callback() : exports.send404(response);
        } else {
          exports.sendResponse(response, data);
        }
      });
    } else {
      exports.sendResponse(response, data);
    }
  });
}

exports.sendRedirect = function(response, location, statusCode = 302) {
  response.writeHead(statusCode, {Location: location});
  response.end();
}


// As you progress, keep thinking about what helper functions you can put here!
