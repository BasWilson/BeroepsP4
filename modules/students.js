module.exports = {

  sendResponse: function(responseData) {

  nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: 'smtp.strato.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
              user: 'tickets@onpointcoding.com', // generated ethereal user
              pass: 'webmail123' // generated ethereal password
          }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Beoordelings Systeem" <tickets@onpointcoding.nl>', // sender address
          to: responseData.email, // list of receivers
          subject: 'Uw vraag over het beoordelings systeem', // Subject line
          html: '<h3>Beste '+responseData.name+',</h3><p> Uw vraag: '+responseData.message+' <br> <br> Ons antwoord: '+responseData.response+'.<br><br> <b>Wij hopen dat dit uw antwoord u genoeg heeft geholpen!</b><br><br></p>' // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          console.log(responseData.email);

      });
  });

},

};

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);
var sha256 = require('js-sha256');
var randomFloat = require('random-float');
var nodemailer = require('nodemailer');

//Modules
var fb = require('./fb');
