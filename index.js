/*const { SimpleResponse, Carousel , Image , BasicCard , BrowseCarousel} = require('dialogflow-fulfillment/node_modules/actions-on-google/dist/service/actionssdk');*/
const {  dialogflow,  BasicCard , Button,  Carousel,  Image,  LinkOutSuggestion, List,  MediaObject,  Suggestions,  SimpleResponse } = require('dialogflow-fulfillment/node_modules/actions-on-google/dist/service/actionssdk');
const { BrowseCarousel, BrowseCarouselItem } = require('actions-on-google')
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
            path: '/GoogleAssistant/GetMainMenu',
            method: 'GET',
            rejectUnauthorized: false,
            agent: false,
     })
    response.send(retJSON.menu.packages.packageList[0])
    response.end()
})
app.get('/index', (req, res) => {
 res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/Hello', async (request, response) => {
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
        agent.add(`สวัสดีครับ มีอะไรให้อุ่นใจช่วยครับ`)
    }

    function fallback(agent) {
        agent.add(`I don't understand`)
        agent.add(`I am sorry. Can you repeat again`)
    }

   
    
    async function bestSellerHandler(agent) {
        const simImg = [
            'https://store.ais.co.th/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/2/12call_sim2fly_399_b_1.jpg',
            'https://store.ais.co.th/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/2/12call_sim2fly_899_b.jpg',
            'https://store.ais.co.th/media/catalog/product/cache/2/image/320x/040ec09b1e35df139433887a97daa66f/s/i/sim_marathon850_3.jpg'
        ]
        
     

      
        let retJSON = await https.getJSON({
            host: '110.49.202.87',
            port: 8443,
            path: '/GoogleAssistant/GetMainMenu',
            method: 'GET',
            rejectUnauthorized: false,
            agent: false,
        })
        let res1 = retJSON.menu.packages.packageList[0];
        let res2 = retJSON.menu.packages.packageList[1];
        let res3 = retJSON.menu.packages.packageList[2];
        const packagename1 = res1.packageName_TH;
        const packagedetail1 = res1.packageDetail_TH;
        const packagename2 = res2.packageName_TH;
        const packagedetail2 = res2.packageDetail_TH;
        const packagename3 = res3.packageName_TH;
        const packagedetail3 = res3.packageDetail_TH;
        const greeting = res1.groupName_TH;
        let conv = agent.conv()
        conv.ask(new SimpleResponse({
           // speech: '<speak>อุ่นใจแนะนำ Sim<sub alias="ทู">2</sub>Fly ราคาประหยัดครับ</speak>',
            speech: 'อุ่นใจขอแนะนำ ' + greeting,
            text: greeting
        }))
        
        conv.ask(new Carousel({
            items: {
                'Select_399': {
                    title: packagename1,
                    description: packagedetail1,
                    image: new Image({
                        url: simImg[0], alt: packagename1
                    })
                },
                'Select_899': {
                     title: packagename2 ,
                    description: packagedetail2 ,
                    image: new Image({
                        url: simImg[1], alt: packagename2
                    })
                },
                'Select_600': {
                     title: packagename3 ,
                    description: packagedetail3 ,
                    image: new Image({
                        url: simImg[2], alt: packagename3 
                    })
                }
            }
        }))
        agent.add(conv)
    }

    
    function sim2fly(agent) {
        
        agent.add("อุ่นใจแนะนำ Sim 2 Fly ราคาประหยัดครับ")
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
        agent.add(`คุณมียอดเงินคงเหลือ ${retJSON.balance} บาท สนใจเติมเงินมั้ยครับ`)
        agent.add(new Suggestion(`Open MY AIS`))
        
        agent.add(new Card({
            title: `ยอดเงิน`,
            imageUrl: `https://colinbendell.cloudinary.com/image/upload/c_crop,f_auto,g_auto,h_350,w_400/v1512090971/Wizard-Clap-by-Markus-Magnusson.gif`,
            text: `<center><font color="green">คุณมียอดเงินคงเหลือ <b>${retJSON.balance}</b> บาท</font></center>`
            
        }))
     

        
    }
   
   async function onHandler2(agent){
        let conv = agent.conv()
        const t= JSON.stringify(req.body);
          conv.ask(new SimpleResponse({
       // speech: '<speak>อุ่นใจแนะนำ Sim<sub alias="ทู">2</sub>Fly ราคาประหยัดครับ</speak>',
        speech: 'อุ่นใจขอแนะนำ',
        text: 'อุ่นใจขอแนะนำ'
        }))
         conv.ask(new BasicCard({
          text: /*`This is a basic card.  Text in a basic card can include "quotes" and
          most other unicode characters including emoji 📱.  Basic cards also support
          some markdown formatting like *emphasis* or _italics_, **strong** or
          __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other
          things like line  \nbreaks`*/t, // Note the two spaces before '\n' required for
                                       // a line break to be rendered in the card.
          subtitle: 'This is a subtitle',
          title: 'Title: this is a title',
          buttons: new Button({
            title: 'This is a button',
            url: 'http://www.ais.co.th/roaming/sim2fly/?gclid=CjwKCAjww6XXBRByEiwAM-ZUIFrTKb_iEnZqewsMkYG8kFvliueHR1sX3-cFfQPo_hvcGtiRbo_68RoC1SIQAvD_BwE&s_kwcid=AL!897!3!259718486577!e!!g!!sim2fly&ef_id=WnKrygAAAdEwtceS:20180502080316:s',
          }),
          image: new Image({
            url: 'https://store.ais.co.th/media/catalog/product/cache/2/image/320x/040ec09b1e35df139433887a97daa66f/s/i/sim_marathon850_3.jpg',
            alt: 'Image alternate text',
          }),
        }));        
        agent.add(conv)
   }
    
    
   async function onHandler(agent){
      let conv = agent.conv()
  conv.ask(new SimpleResponse({
       // speech: '<speak>อุ่นใจแนะนำ Sim<sub alias="ทู">2</sub>Fly ราคาประหยัดครับ</speak>',
        speech: 'อุ่นใจขอแนะนำ',
        text: 'อุ่นใจขอแนะนำ'
    }))
    /*      
   const a11yText = 'Google Assistant Bubbles';
   const googleUrl = 'http://www.ais.co.th/roaming/sim2fly/?gclid=CjwKCAjww6XXBRByEiwAM-ZUIFrTKb_iEnZqewsMkYG8kFvliueHR1sX3-cFfQPo_hvcGtiRbo_68RoC1SIQAvD_BwE&s_kwcid=AL!897!3!259718486577!e!!g!!sim2fly&ef_id=WnKrygAAAdEwtceS:20180502080316:s';
      conv.ask(new BrowseCarousel({
          title: 'Google Assistant',
          items: [
            new BrowseCarouselItem({
              title: 'Title of item 1',
              url: 'http://www.ais.co.th/roaming/sim2fly/?gclid=CjwKCAjww6XXBRByEiwAM-ZUIFrTKb_iEnZqewsMkYG8kFvliueHR1sX3-cFfQPo_hvcGtiRbo_68RoC1SIQAvD_BwE&s_kwcid=AL!897!3!259718486577!e!!g!!sim2fly&ef_id=WnKrygAAAdEwtceS:20180502080316:s',
              description: 'Description of item 1',
              image: new Image({
                url: 'https://store.ais.co.th/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/2/12call_sim2fly_899_b.jpg',
                alt: 'hello',
              }),
              footer: 'Item 1 footer',
            }),
            new BrowseCarouselItem({
              title: 'Title of item 2',
              url: 'http://www.ais.co.th/roaming/sim2fly/?gclid=CjwKCAjww6XXBRByEiwAM-ZUIFrTKb_iEnZqewsMkYG8kFvliueHR1sX3-cFfQPo_hvcGtiRbo_68RoC1SIQAvD_BwE&s_kwcid=AL!897!3!259718486577!e!!g!!sim2fly&ef_id=WnKrygAAAdEwtceS:20180502080316:s',
              description: 'Description of item 2',
              image: new Image({
                url: 'https://store.ais.co.th/media/catalog/product/cache/2/image/320x/040ec09b1e35df139433887a97daa66f/s/i/sim_marathon850_3.jpg',
                alt: 'hell',
              }),
              footer: 'Item 2 footer',
            }),
          ],
        }));*/
    

  
 
    conv.ask(new List({
     title: 'List Title',
      items: {
        // Add the first item to the list
        'select_1': {     
          title: 'Title of First List Item',
          description: 'This is a description of a list item.',
          image: new Image({
            url: 'https://store.ais.co.th/media/catalog/product/cache/2/image/320x/040ec09b1e35df139433887a97daa66f/s/i/sim_marathon850_3.jpg',
            alt: 'Image alternate text',
          }),
        },
        // Add the second item to the list
       'select_2': {      
          title: 'Google Home',
          description: 'Google Home is a voice-activated speaker powered by ' +
            'the Google Assistant.',
          image: new Image({
            url: 'https://store.ais.co.th/media/catalog/product/cache/2/image/320x/040ec09b1e35df139433887a97daa66f/s/i/sim_marathon850_3.jpg',
            alt: 'Google Home',
          }),
        },
        // Add the third item to the list
        'select_3': {    
          title: 'Google Pixel',
          description: 'Pixel. Phone by Google.',
          image: new Image({
            url: 'https://store.ais.co.th/media/catalog/product/cache/2/image/320x/040ec09b1e35df139433887a97daa66f/s/i/sim_marathon850_3.jpg',
            alt: 'Google Pixel',
          }),
        },
      },
    }));
        
      
     
        agent.add(conv)
    }

    let intentMap = new Map()

    intentMap.set('Default Welcome Intent', balanceHandler)
    intentMap.set('Default Fallback Intent', fallback)
    intentMap.set('Ontop', bestSellerHandler)
    intentMap.set('Balance', balanceHandler)
    intentMap.set('sample', onHandler)
    intentMap.set('sample2', onHandler2)
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
