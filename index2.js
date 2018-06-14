const processor = require('./processor')
const express = require('express'),
    bodyParser = require('body-parser')


const https = require('./synchttps')

const PORT = process.env.PORT || 4200

const app = express(bodyParser.json())

app.use(bodyParser.json())

app.get('/',function(req,res){
       
     res.sendFile('JWT2.html');

});


app.listen(PORT, (error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log(`listening at port ${PORT}`)
    }
})
