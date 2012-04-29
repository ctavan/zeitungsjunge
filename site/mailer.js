var nodemailer = require('nodemailer');
var fs = require('fs');

function send(content, callback) {
  
  var myAuth = JSON.parse(fs.readFileSync('../database/.authSendGrid.json'));
  var myMail = JSON.parse(fs.readFileSync('../database/.logMail.json')).email;
  
  // opens pool of SMTP connections
  var smtpTransport = nodemailer.createTransport('SMTP', myAuth);
  
  // setup e-mail data
  var mailOptions = {
    from: 'Zeitungsjunge: LOGMAIL <log@zeitungsjunge.tk>',
    to: myMail,
    subject: content.subject,
    text: content.body,
    attachments:[{
                    fileName: 'sendServer.log',
                    streamSource: fs.createReadStream( '../log/server.log'),
                    cid: new Date().getTime() // should be as unique as possible
                },
                {
                    fileName: 'subscriptions.json',
                    streamSource: fs.createReadStream( '../database/subscriptions.json'),
                    cid: new Date().getTime() // should be as unique as possible
                }
                ]
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
