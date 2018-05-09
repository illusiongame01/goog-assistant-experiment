const processor = require('./processor')
const express = require('express'),
    bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Card, Suggestion } = require('dialogflow-fulfillment')

const PORT = process.env.PORT || 4200


const app = express(bodyParser.json())

app.use(bodyParser.json())

const https = require('https');

const unirest = require('unirest');



//app.get('/', (request, response) => response.send({"msg": "Hello world!"}))

app.get('/', function (request, response) {
        let balance = '';
        var req = unirest("GET", "https://110.49.202.87:8443/GoogleAssistant/GetCurrentBalacnce/66932780014").strictSSL(false);     
                req.end(function(res) {
                if(res.error) {
                    console.log(res.error)
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Error. Can you try it again ? ",
                        "displayText" : "Error. Can you try it again ? "
                    }));
                } else  {
                    let result = res.body;
                    let output = '';
                 
                        output += result.balance;
                        output+="\n"
                        balance = JSON.stringify(res.body);
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "Object" : result,
                    })); 
                }
          
            });
                
});

app.post('/', function (req, res) {
    console.log("Request Header: " + JSON.stringify(req.headers))
    console.log("Request Body: " + JSON.stringify(req.body))

    req = processor(req)

    const agent = new WebhookClient({request: req, response: res})

    function welcome(agent) {
        agent.add(`สวัสดีครับ มีอะไรให้อุ่นใจช่วยครับ`)
    }

    function fallback(agent) {
        agent.add(`I don't understand`)
        agent.add(`I am sorry. Can you repeat again`)
    }

     function sim2fly(agent) {
         let balance = '2';
          agent.add("ตรวจสอบยอดเงินคงเหลือ")
           var request = unirest("GET", "https://110.49.202.87:8443/GoogleAssistant/GetCurrentBalacnce/66932780014").strictSSL(false);     
             agent.add("สวัสดี")     
             await setTimeout(()=>{}, 2000); 
              request.end(function(res) {
                if(res.error) {
                    console.log(res.error)
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Error. Can you try it again ? ",
                        "displayText" : "Error. Can you try it again ? "
                    }));
                } else  {
                    let result = res.body;
                    let output = '';
                 
                      
                     
                    agent.add("ยอดเงินคงเหลือคือ :")
                    agent.add(result.balance)
                }
            });
             
              agent.add("อุ่นใจแนะนำ Sim 2 Fly ราคาประหยัด")
              agent.add(new Card({
            title: `Sim 2 Fly`,
            imageUrl: `https://store.ais.co.th/media/wysiwyg/product/product-description/Sim/SIM2Fly_LINEHome1040x1040_Compress.jpg`,
            text: `Sim 2 Fly โรมมิ่ง ราคาประหยัด`,
            buttonText: `ดูข้อมูลเพิ่มเติม`,
            buttonUrl: `http://www.ais.co.th/roaming/sim2fly/?gclid=CjwKCAjww6XXBRByEiwAM-ZUIFrTKb_iEnZqewsMkYG8kFvliueHR1sX3-cFfQPo_hvcGtiRbo_68RoC1SIQAvD_BwE&s_kwcid=AL!897!3!259718486577!e!!g!!sim2fly&ef_id=WnKrygAAAdEwtceS:20180502080316:s`,
        }))
    }

    function onTopHandler(agent) {
        agent.add(`<speak>สามารถเลือกแพกเกจเสริมได้ที่แอป My <say-as interpret-as="verbatim">AIS</say-as> ครับ</speak>`)
    }

    let intentMap = new Map()

    intentMap.set('Default Welcome Intent', welcome)
    intentMap.set('Default Fallback Intent', fallback)
    intentMap.set('Ontop-Promotion', sim2fly)
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
