var fs = require("fs"),
    querystring = require("querystring"),
    mailer = require("./mailer"),
    util = require('util'),
    database = require('./database'),
    logger = require('../log/logger');

function subscribe(response) {
  readStream = fs.createReadStream("html/subscribe.html");
  response.writeHead(200, {"Content-Type": "text/html"});
  readStream.pipe(response);
};

function unsubscribe(response) {
  readStream = fs.createReadStream("html/unsubscribe.html");
  response.writeHead(200, {"Content-Type": "text/html"});
  readStream.pipe(response);
};

function faq(response) {
  readStream = fs.createReadStream("html/faq.html");
  response.writeHead(200, {"Content-Type": "text/html"});
  readStream.pipe(response);
};

function showError(response) {
  readStream = fs.createReadStream("html/error.html");
  response.writeHead(200, {"Content-Type": "text/html"});
  readStream.pipe(response);
  logMailer.send( {subject: 'An error occured.', body: ''}, function(error, mailResponse) {
    if (error) {
      logger.log("Error site shown: " + error + ' ' + response);
    };
  });
};

function contact(response) {
  readStream = fs.createReadStream("html/contact.html");
  response.writeHead(200, {"Content-Type": "text/html"});
  readStream.pipe(response);
};

function contactConfirm(response, postData) {
  postString = util.inspect(querystring.parse(postData));
  response.writeHead(200, {"Content-Type": "text/html"});
  readStream = fs.createReadStream("html/contactConfirm.html");
  readStream.pipe(response);
  logger.log("contact form send: " + postString);
  mailer.send( {subject: 'A contact form has been send.', body: 'Contact form:\n' + postString}, function(error, mailResponse) {
    if (error) {
      logger.log("Mail error: " + error + ' ' + mailResponse);
    };
  });
};

function home(response) {
  readStream = fs.createReadStream("html/index.html");
  response.writeHead(200, {"Content-Type": "text/html"});
  readStream.pipe(response);
};

function css(response) {
  readStream = fs.createReadStream("html/main.css");
  readStream.pipe(response);
};

function favicon(response) {
  readStream = fs.createReadStream("html/favicon.ico");
  readStream.pipe(response);
};

function image(response) {
  readStream = fs.createReadStream("html/kindlepic.png");
  readStream.pipe(response);
};

function subscribeConfirm(response, postData) {
  try {
    postString = util.inspect(querystring.parse(postData));
    database.addSubscription(querystring.parse(postData)); // blocking I/O
    response.writeHead(200, {"Content-Type": "text/html"});
    readStream = fs.createReadStream("html/subscribeConfirm.html");
    readStream.pipe(response);
  } catch (error) {
    logger.log("Subscribtion error: " + error + ' w/ POST: ' + postString);
    showError(response);
  };
  mailer.send( {subject: 'New Subscription.', body: 'New Subscription:\n' + postString}, function(error, mailResponse) {
    if (error) {
      logger.log("Mail error: " + error + ' w/ response: ' + mailResponse);
    };
  });          
};

function unsubscribeConfirm(response, postData) {
  try {
    postString = util.inspect(querystring.parse(postData));
    database.removeSubscription(querystring.parse(postData)); // blocking I/O
    response.writeHead(200, {"Content-Type": "text/html"});
    readStream = fs.createReadStream("html/unsubscribeConfirm.html");
    readStream.pipe(response);
  } catch (error) {
    logger.log("Unsubscribtion error: " + error.message + ' w/ POST: ' + postString);
    showError(response)
  };
};



exports.home = home;
exports.subscribe = subscribe;
exports.subscribeConfirm = subscribeConfirm;
exports.unsubscribe = unsubscribe;
exports.unsubscribeConfirm = unsubscribeConfirm;
exports.css = css;
exports.favicon = favicon;
exports.image = image;
exports.faq = faq;
exports.showError = showError;
exports.contact = contact;
exports.contactConfirm = contactConfirm;
