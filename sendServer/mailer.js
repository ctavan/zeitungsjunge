var nodemailer = require('nodemailer');
var fs = require('fs');
var database = require('./database');

function send(subscription, callback) {

  var myAuth = JSON.parse(fs.readFileSync('../database/.authSendGrid.json'));

  // opens pool of SMTP connections
  var smtpTransport = nodemailer.createTransport('SMTP', myAuth);
  
  // setup e-mail data
  var mailOptions = {
    from: 'Zustellung <zustellung@zeitungsjunge.tk>',
    to: subscription['subscribers'].join(', '),
    subject: subscription['name'],
    text: '',
    attachments:[{
                    fileName: subscription['name'] + '.mobi',
                    streamSource: fs.createReadStream( 'mobi/' + subscription['name'] + '.mobi'),
                    cid: new Date().getTime() // should be as unique as possible
                }]
    };
  
  // send e-mail
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        callback(error, response);
    } else {
        callback(null, response);
    };
    smtpTransport.close();
  });
};


exports.send = send;
