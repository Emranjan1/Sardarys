const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from Twilio
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from Twilio

const twilioClient = new twilio(accountSid, authToken);

module.exports = twilioClient;
