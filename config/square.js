const { Client } = require('square');

const squareClient = new Client({
  environment: 'sandbox', 
  accessToken: 'EAAAl8obqqrSn0tVghLaYQGXzP9tkl2UUvBaDPXZxQudXvFOvuu-Y6p1d1_JpEkJ' 
});

module.exports = squareClient;

