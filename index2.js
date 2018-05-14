    const https = require("https");
 

    const unirest = require('unirest');
    unirest.get("https://10.137.28.40:8443/GoogleAssistant/GetCurrentBalacnce/66932780014")
    .strictSSL(false)
    .end(console.log)