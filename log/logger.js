var fs = require('fs');

var stream = fs.createWriteStream('../log/server.log', {flags: 'a'});

function log(text) {
  stream.write('[' + Date() + '] ' + text + '.\n\n');
};

exports.log = log;
exports.stream = stream;
