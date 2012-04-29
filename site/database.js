var fs = require("fs");

/*
 * using blocking functions to permit two requests changing 
 * the database file at the same time on the cost of poor scaling
 */

var databaseFilename = '../database/subscriptions.json';

function init () {
  var subscriptions = {
    "4CET" : {},
    "9CET" : {},
    "15CET" : {}
  };
  fs.writeFileSync(databaseFilename, JSON.stringify(subscriptions, null, 2));
};

function removeSubscription(formData) {
  subscriptions = JSON.parse(fs.readFileSync(databaseFilename));
  
  //remove subscriber
  for (var time in subscriptions) {
    for (var paper in subscriptions[time]) {
      var idx = subscriptions[time][paper].indexOf(formData.email);
      if (idx !== -1) {
        subscriptions[time][paper].splice(idx, 1);
      };
    };
  };
  
  //remove empty subscriptions
  for (var time in subscriptions) {
    for (var paper in subscriptions[time]) {
      if (subscriptions[time][paper].length === 0) {
        delete subscriptions[time][paper];
      };
    };
  };
  
  fs.writeFileSync(databaseFilename, JSON.stringify(subscriptions, null, 2));
};


function addSubscription(formData) {
  subscriptions = JSON.parse(fs.readFileSync(databaseFilename));
  
  if ('subscribeTo' in formData && 'email' in formData) {
    
    //single subscription
    if (typeof formData.subscribeTo === 'string') {
      formData.subscribeTo = new Array(formData.subscribeTo);
      }
    
    for (var i = 0; i < formData.subscribeTo.length; i++) {
      var paper = formData.subscribeTo[i].split("_")[0];
      var time  = formData.subscribeTo[i].split("_")[1];
      
      if (!(paper in subscriptions[time])) {
        subscriptions[time][paper] = new Array();
      };
      if (subscriptions[time][paper].indexOf(formData.email) === -1) {
        subscriptions[time][paper].push(formData.email);
      };
    };
    
    fs.writeFileSync(databaseFilename, JSON.stringify(subscriptions, null, 2));
  };
};

exports.addSubscription = addSubscription;
exports.removeSubscription = removeSubscription;
