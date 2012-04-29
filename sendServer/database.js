var fs = require('fs');

function read(time, callback) {
  fs.readFile('../database/subscriptions.json', function(error, data) {
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

read("4", function(err, sub) { console.log(sub) });

exports.read = read;
  
