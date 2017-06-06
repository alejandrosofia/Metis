var config = require('../config');
var logger = (require('../logging/vip-winston')).Logger;
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var messageContent = require('./content');
var stormpathREST = require('stormpath');

if(config.auth.uselocalauth()) {
  logger.info('Stormpath credentials are not set!');
} else {
  var stormpathRESTApiKey = new stormpathREST.ApiKey(config.auth.apiKey, config.auth.apiKeySecret);
  var stormpathRESTClient = new stormpathREST.Client({ apiKey: stormpathRESTApiKey });
}

var transporter = nodemailer.createTransport(sesTransport({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
  rateLimit: config.email.rateLimit,
  region: config.aws.region
}));

var messageOptions = {
  testingComplete: function(message, recipient) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: "A batch address test has completed",
      html: messageContent.testingComplete(message)
    }
  },
  errorDuringTesting: function(message, recipient) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: "A batch address test has failed",
      html: messageContent.errorDuringTesting(message)
    }
  },
};

var sendMessage = function(messageContent) {
  transporter.sendMail(messageContent, function(error, info) {
    if (error) {
      logger.info('Sending error: ' + error);
      logger.info('Message: ' + JSON.stringify(messageContent));
    }
  });
  logger.info("fake sending something!" + messageContent.toString())
};

var notifyGroup = function(message, groupName, contentFn) {
  stormpathRESTClient.getGroups({ name: groupName }, function(err, groups) {
    if (err) throw err;
    groups.each(function(group) {

      group.getAccounts(function(err, accounts) {
        if (err) throw err;

        for( i = 0; i < accounts.items.length; i++ ) {
          var recipient = accounts.items[i];
          var messageContent = contentFn(message, recipient);
          logger.info("sending email to:" + JSON.stringify(recipient));
          logger.info("Content of message:" + JSON.stringify(messageContent));
          sendMessage(messageContent);
        }
      });
    });
  });
};

module.exports = {
  sendNotifications: function(message) {
    if(config.auth.uselocalauth()) {
      logger.warning('A message was trying to be sent but cannot be Stormpath \
                      credentials are not set! Message: ' + message);
    } else {
      var messageType  = (message['status'] == "ok") ? messageOptions['testingComplete'] : messageOptions['errorDuringTesting'] ;
      var groupName = message["groupName"];
      if (groupName === undefined) {
        logger.warning("No group in batch-address.file.complete message.  Can't send batch address testing finished email notification.");
        logger.info(message);
      } else if (groupName === "undefined") {
        if (config.email.adminGroup === undefined || config.email.adminGroup === null) {
          logger.warning("No admin group defined.  Can't send batch address testing finished email notification.");
          logger.info(message);
        } else {
          notifyGroup(message, config.email.adminGroup, messageType);
        }
      } else {
        notifyGroup(message, groupName, messageType);
      }
    }
  }
};
