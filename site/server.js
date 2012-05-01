var express = require('express'),
  url = require('url'),
  fs = require('fs'),
  logger = require('../log/logger');

function authorize(username, password) {
  logger.log("User: " + username);
  var myAuth = JSON.parse(fs.readFileSync('../database/.authUsers.json'));
  return myAuth.password === password;
};

function start(route, handle) {
  
  function onRequest(request, response) {
    
    var postData = "";
    var pathname = url.parse(request.url).pathname;

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
    });

    request.addListener("end", function() {
      route(handle, pathname, response, postData);
    });

  }

  express.createServer(
    express.basicAuth(authorize),
    express.logger({
      stream: logger.stream,
      format: '[:date] IP: :remote-addr :method :url w/ :status '
      }),
    onRequest
    ).listen(8080);
  
  logger.log("siteServer has started");
}

exports.start = start;
