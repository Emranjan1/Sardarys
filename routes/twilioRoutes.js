const express = require('express');
const router = express.Router();

router.post('/sms', (req, res) => {
    const messageFrom = req.body.From;
    const messageBody = req.body.Body;

    console.log(`New SMS from ${messageFrom}: ${messageBody}`);

    res.contentType('text/xml');
    res.send('<Response><Message>Thank you for your message.</Message></Response>');
});

module.exports = router;
