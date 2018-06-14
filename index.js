var express = require("express");
var app     = express();
var path    = require("path");
const PORT = process.env.PORT || 4200

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/error404.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/about',function(req,res){
  res.sendFile(path.join(__dirname+'/JWT2.html'));
});

app.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/JWT2.html'));
});


app.listen(PORT, (error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log(`listening at port ${PORT}`)
    }
})

console.log("Running at Port 4200");
