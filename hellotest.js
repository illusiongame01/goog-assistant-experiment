const processor = require('./processor')
const express = require('express'),
    bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment')

// HTTP
const http = require('http')

const app = express(bodyParser.json())

app.use(bodyParser.json())

app.get('/', (request, response) => response.send({"msg": "Hello world!"}))

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


