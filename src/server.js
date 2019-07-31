const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const request = require('request')
const smsParse = require('./middleware/smsParse')
let handleError = require('./middleware/handleError')

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())

// Handle incoming text to get the balance of specefied budget
app.post('/', smsParse, (req,res) => {
  let twiml = new MessagingResponse();
  twiml.message(res.message);
  res.writeHead(200,{'Content-Type': 'text/xml'});
  res.end(twiml.toString())
})

app.use(handleError)

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337')
})
