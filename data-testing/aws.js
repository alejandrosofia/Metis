var AWS = require('aws-sdk');
var fs = require('fs');
var multiparty = require('multiparty');
var config = require('../config');
var queue = require('./queue')
var logger = (require('../logging/vip-winston')).Logger;

AWS.config.update({ accessKeyId: config.aws.accessKey, secretAccessKey: config.aws.secretKey });
var batchAddressBucket = config.batt.batchAddressBucket;

module.exports = {
  uploadAddressFile: function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      var fipsCode = fields["fipsCode"];
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(JSON.stringify(files));
      var fileStream = fs.createReadStream(files.file.path);
      fileStream.on('error', function (err) {
        if (err) { throw err; }
      });
      fileStream.on('open', function () {
        var s3 = new AWS.S3();
        if (fipsCode === undefined) {
          fipsCode = "undefined"
        };
        var bucketName = batchAddressBucket;
        var fileName = fipsCode + '/input/' + files.file.originalFilename;
        logger.info("putting file with name '" + fileName + "' into bucket '" + bucketName + "'");
        s3.putObject({
          Bucket: bucketName,
          Key: fileName,
          Body: fileStream
        }, function (err) {
          if (err) {
            throw err;
          } else {
            queue.submitAddressFile(bucketName, fileName, fipsCode);
          }
        });
      });
    });


    return;

  },
  getLatestResultsFile: function(req, res){
    var s3 = new AWS.S3();
    var fipsCode = req.query.fipsCode;
    if (fipsCode === undefined) {
      fipsCode = "undefined";
    }
    var bucketName = batchAddressBucket;
    var fileName  = fipsCode + "/output/results.csv"

    var params = {
      Bucket: bucketName,
      MaxKeys: 1,
      Prefix: fileName
    };
    s3.listObjectsV2(params, function(err, data) {
      if (err) {
        logger.error(err, err.stack);
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end();
      } else {
        logger.info(JSON.stringify(data));
        if (data["Contents"].length > 0) {
          var params = {Bucket: bucketName, Key: fileName, Expires: 3600};
          logger.info("requesting from Amazon with params: " + JSON.stringify(params));
          var url = s3.getSignedUrl('getObject', params);
          logger.info("generated pre-signed URL " + url);
          res.writeHead(200, {'content-type': 'text/plain'});
          res.write(url);
          res.end();
        } else {
          res.writeHead(404, {'content-type': 'text/plain'});
          res.end();
        }
      }
    });
  }
};