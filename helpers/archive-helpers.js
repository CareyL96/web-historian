var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback, path) {
  fs.readFile(exports.paths.list, 'utf-8', (err, site) => {
    if (err) {
      console.log('error');
    } else {
      let siteList = site.toString().split('\n')
      if (callback) {
        callback(siteList);
      }
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(siteList => {
    if (siteList.indexOf(url) > -1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', (err) => {
    callback();
  })
};

exports.isUrlArchived = function(url, callback) {
  var sitePath = path.join(exports.paths.archivedSites, url);
  fs.exists(sitePath, (exists) => {
    callback(exists);
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, url => {
    if(!url) { return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};









