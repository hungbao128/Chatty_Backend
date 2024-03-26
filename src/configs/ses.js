const ServerErrorRequest = require('../core/ServerErrorRequest');
const EnvConfig = require('./../envConfig');
const { SendEmailCommand, SESClient } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({
    region: EnvConfig.AWS_REGION,
    credentials: {
      secretAccessKey: EnvConfig.AWS_ACCESS_SECRET_KEY,
      accessKeyId: EnvConfig.AWS_ACCESS_KEY_ID1
  }
})

const sendEmail = async (to, subject, body) => {
    const params = {
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: body
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        Source: EnvConfig.AWS_SES_FROM_ADDRESS
    }

    try{
        await sesClient.send(new SendEmailCommand(params));
    } catch (err){
        throw new ServerErrorRequest(err.message);
    }
}


module.exports = {sendEmail};