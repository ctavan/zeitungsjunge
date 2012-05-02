var fs = require('fs');

var databaseFilename = '../database/subscriptions.json';

function init () {
  var subscriptions = {
    "4CET" : {},
    "9CET" : {},
    "15CET" : {}
  };
  fs.writeFileSync(databaseFilename, JSON.stringify(subscriptions, null, 2));
};


function read(time, callback) {
  fs.readFile(databaseFilename, function(error, data) {
    if (error) {
      callback(error, null)
    } else {
      subscriptionsJSON = JSON.parse(data)[time + 'CET'];
      subscriptions = new Array();
      for (paper in subscriptionsJSON) {
        subscriptions.push({'name': paper, 'subscribers': subscriptionsJSON[paper]});
      };
      callback(null, subscriptions);
    };
  });
};

exports.read = read;
  
