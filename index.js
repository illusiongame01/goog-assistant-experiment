const processor = require('./processor')
const express = require('express'),
    bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment')

// HTTP
const http = require('http')
const https = require('https');

const app = express(bodyParser.json())



app.use(bodyParser.json())

//app.get('/', (request, response) => response.send({"msg": "Hello world!"}))

  // https.get('https://110.49.202.87:8443/GoogleAssistant/GetCurrentBalacnce/66932780014', (resp) => {
    https.get('https://110.49.202.87:8443/GoogleAssistant/GetCurrentBalacnce/66932780014', (resp) => {  
  let data = '';
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data).explanation);
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

app.post('/', (req, res) => {
    console.log("Request Header: " + JSON.stringify(req.headers))
    console.log("Request Body: " + JSON.stringify(req.body))

    req = processor(req)

    const agent = new WebhookClient({request: req, response: res})

    function welcome(agent) {
        agent.add(`welcome to my agent`)
    }

    function fallback(agent) {
        agent.add(`I don't understand`)
        agent.add(`I am sorry. Can you repeat again`)
    }

    let intentMap = new Map()

    intentMap.set('Default Welcome Intent', welcome)
    intentMap.set('Default Fallback Intent', fallback)
    
    agent.handleRequest(intentMap)
})

app.listen(4200, (error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log("listening at port 4200")
    }
})

// HTTPS goes here :)


