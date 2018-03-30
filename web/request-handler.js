var archive = require('../helpers/archive-helpers');
var path = require('path');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

var actions = {
  'GET': function(request, response) {
    var urlPath = url.parse(request.url).pathname;

    if (urlPath === '/') { urlPath = '/index.html'; }

    httpHelpers.serveAssets(response, urlPath, function() {
      if (urlPath[0] === '/') { urlPath = urlPath.slice(1); }
      archive.isUrlInList(urlPath, function(found) {
        if (found) {
          httpHelpers.sendRedirect(response, '/loading.html');
        } else {
          httpHelpers.send404(response);
        }
      });
    });
  },
  
  'POST': (request, response) => {
    httpHelpers.collectData(request, data => {
      var url = data.slice(4);
      archive.isUrlInList(url, found => {
        if (found) {
          archive.isUrlArchived(url, exists => {
            if (exists) {
              httpHelpers.sendRedirect(response, '/' + url);
            } else {
              httpHelpers.sendRedirect(response, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, () => {
            httpHelpers.sendRedirect(response, '/loading.html');
          });
        }
      }) 
    });
  }
}

exports.handleRequest = function (request, response) {
  // if request type exists, perform action 
  if (actions[request.method]) {
    actions[request.method](request, response);
  }
};
