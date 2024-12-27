const express = require('express');
const router = express.Router();

router.post('/sms', (req, res) => {
    const messageFrom = req.body.From;
    const messageBody = req.body.Body;

    console.log(`New SMS from ${messageFrom}: ${messageBody}`);
    // Here you could further process the message or trigger other functionalities

    // Sending a simple response back to Twilio
    res.contentType('text/xml');
    res.send('<Response><Message>Thank you for your message.</Message></Response>');
});

module.exports = router;
