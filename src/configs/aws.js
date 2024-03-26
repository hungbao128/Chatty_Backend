const AWS = require('aws-sdk');
const { SendEmailCommand, SESClient } = require('@aws-sdk/client-ses')

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const sesClient = new AWS.SES
module.exports = AWS;