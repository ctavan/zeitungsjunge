var database = require('./database'),
    mailer = require ('./mailer'),
    exec = require('child_process').exec,
    fs = require('fs'),
    cronJob = require('cron').CronJob,
    async = require('async'),
    inspect = require("util").inspect,
    logger = require('../log/logger');

function sendPaper(subscription, callback) {
  //downloading websites using calibre (http://calibre-ebook.com)
  exec('ebook-convert recipes/' + subscription["name"] + '.recipe mobi/' + subscription["name"] + '.mobi --output-profile kindle', function (error, stdout, stderr) {
    if (error) {
      logger.log('Download error: ' + subscription["name"] + '. Calibre output following');
      logger.log('stdout: ' + stdout);
      logger.log('stderr: ' + stderr);
      callback(error, null);
    } else {
      logger.log ('Successful download of ' + subscription["name"]);
      //send .mobi to kindle subscribers
      mailer.send(subscription, function(error, response) {
        if (error) {
          logger.log('Sending error. Response: ' + response);
          logger.log('List of subscribers: ' + subscription['subscribers']);
          callback(error, null);
        } else {
          logger.log(subscription['name'] + ' successful sent to: ' + subscription['subscribers']);
          callback(null, null);
        };
      });
    };
  });
};

  
var startJob = function(time) {
  
  //start cron job to download and send paper daily at <time> o'clock
  new cronJob(time + ' ' + time + ' ' + time + ' * * *', function() {
    logger.log('Start cron job: ' + time + 'h');
    
    //read name of papers and its subscribers from database
    database.read(time, function (error, subscriptions) {
      if (error) {
        logger.log('Data base error: '+ error);
      } else {
        //download all papers, convert to .mobi format and send to subscribers
        async.forEachLimit(subscriptions, 2 ,sendPaper, function(error) {
          if (error) {
            logger.log('Sending error: ' + error);
          } else {
            logger.log('Finished cron job: ' + time + "h");           
          };
        });
      };
    });
  }, null, true);
};

var sendMail = function(timeStr) {
  switch (timeStr) {
    case 'morning': startJob('4');
                    break;
    case 'noon':    startJob('9');
                    break;
    case 'evening': startJob('15');
                    break;
    default:        throw new Error('Unaccepted time string.');
  };
};
        
logger.log('SendServer started');                    
sendMail('morning');
sendMail('noon');
sendMail('evening');

