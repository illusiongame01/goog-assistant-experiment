const { SimpleResponse, Carousel, Image } = require('dialogflow-fulfillment/node_modules/actions-on-google/dist/service/actionssdk');

const processor = require('./processor')
const express = require('express'),
    bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Card, Suggestion } = require('dialogflow-fulfillment')

const https = require('./synchttps')

const PORT = process.env.PORT || 4200


const app = express(bodyParser.json())

app.use(bodyParser.json())

app.get('/', async (request, response) => {
    let retJSON = await https.getJSON({
        host: '110.49.202.87',
        port: 8443,
        path: '/GoogleAssistant/GetCurrentBalacnce/66932780014',
        method: 'GET',
        rejectUnauthorized: false,
        agent: false,
    })
    response.send(retJSON)
    response.end()
})

app.get('/top-seller', async (request, response) => {
    await https.get({
        host: '110.49.202.87',
        port: 8443,
        path: '/GoogleAssistant/GetMainMenu',
        method: 'GET',
        rejectUnauthorized: false,
        agent: false,
    }, (res) => {
        let data = ''

        res.on('data', (x) => {data += x})

        res.on('end', () => {
            response.send(JSON.parse(data))
            response.end()
        })
    }).on('error', (e) => {
        console.log(e)
        response.send({error: e})
    })
})

app.post('/', (req, res) => {
    console.log("Request Header: " + JSON.stringify(req.headers))
    console.log("Request Body: " + JSON.stringify(req.body))

    req = processor(req)

    const agent = new WebhookClient({request: req, response: res})

    function welcome(agent) {
        agent.add(`เธชเธงเธฑเธชเธ”เธตเธเธฃเธฑเธ เธกเธตเธญเธฐเนเธฃเนเธซเนเธญเธธเนเธเนเธเธเนเธงเธขเธเธฃเธฑเธ`)
    }

    function fallback(agent) {
        agent.add(`I don't understand`)
        agent.add(`I am sorry. Can you repeat again`)
    }

    function sim2fly(agent) {
        const simImg = [
            'https://store.ais.co.th/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/2/12call_sim2fly_399_b_1.jpg',
            'https://store.ais.co.th/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/2/12call_sim2fly_899_b.jpg',
        ]

        let conv = agent.conv()
        conv.ask(new SimpleResponse({
            speech: '<speak>เธญเธธเนเธเนเธเนเธเธฐเธเธณ Sim<sub alias="เธ—เธน">2</sub>Fly เธฃเธฒเธเธฒเธเธฃเธฐเธซเธขเธฑเธ”เธเธฃเธฑเธ</speak>',
            text: 'เธญเธธเนเธเนเธเนเธเธฐเธเธณ Sim2Fly เธฃเธฒเธเธฒเธเธฃเธฐเธซเธขเธฑเธ”เธเธฃเธฑเธ โ๏ธ'
        }))
        conv.ask(new Carousel({
            items: {
                'Select_399': {
                    title: `Sim 2 Fly 399`,
                    description: `เน€เธญเน€เธเธตเธข, เธญเธญเธชเน€เธ•เธฃเน€เธฅเธตเธข ๐—ผ`,
                    image: new Image({
                        url: simImg[0], alt: 'Sim2Fly 399'
                    })
                },
                'Select_899': {
                    title: `Sim 2 Fly 899`,
                    description: "เธขเธธเนเธฃเธ เธญเน€เธกเธฃเธดเธเธฒ เนเธฅเธฐเธญเธทเนเธ ๐",
                    image: new Image({
                        url: simImg[1], alt: 'Sim2Fly 899'
                    })
                }
            }
        }))
        agent.add(conv)
    }

    function onTopHandler(agent) {
        agent.add(`<speak>เธชเธฒเธกเธฒเธฃเธ–เน€เธฅเธทเธญเธเนเธเธเน€เธเธเน€เธชเธฃเธดเธกเนเธ”เนเธ—เธตเนเนเธญเธ My <say-as interpret-as="verbatim">AIS</say-as> เธเธฃเธฑเธ</speak>`)
        agent.add(new Suggestion(`Open MY AIS`))
    }

    async function balanceHandler(agent) {
        let retJSON = await https.getJSON({
            host: '110.49.202.87',
            port: 8443,
            path: '/GoogleAssistant/GetCurrentBalacnce/66932780014',
            method: 'GET',
            rejectUnauthorized: false,
            agent: false,
        })
        agent.add(`เธเธธเธ“เธกเธตเธขเธญเธ”เน€เธเธดเธเธเธเน€เธซเธฅเธทเธญ ${retJSON.balance} เธเธฒเธ— เธชเธเนเธเน€เธ•เธดเธกเน€เธเธดเธเธกเธฑเนเธขเธเธฃเธฑเธ`)
        agent.add(new Suggestion(`Open MY AIS`))
    }

    let intentMap = new Map()

    intentMap.set('Default Welcome Intent', balanceHandler)
    intentMap.set('Default Fallback Intent', fallback)
    intentMap.set('ir:roaming', sim2fly)
    intentMap.set('on-top', onTopHandler)
    intentMap.set('top-up', balanceHandler)
    agent.handleRequest(intentMap)
})

app.listen(PORT, (error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log(`listening at port ${PORT}`)
    }
})
