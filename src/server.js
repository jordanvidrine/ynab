const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const request = require('request')
const smsParse = require('./middleware/smsParse')

const app = express();
app.use(bodyParser.urlencoded({extended:false}));

// example to send text on POST request
//
// app.post('/sms', (req,res) => {
//   const twiml = new MessagingResponse();
//   twiml.message('The Robots are coming! Head for the hills!');
//
//   res.writeHead(200,{'Content-Type': 'text/xml'});
//   res.end(twiml.toString())
// });

// Handle incoming text to get the balance of specefied budget
app.post('/', smsParse, (req,res) => {
  res.status(200).send(res.message)
})

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337')
})
