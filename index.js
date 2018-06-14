var express = require("express");
var app     = express();
var path    = require("path");


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/JWT2.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/about',function(req,res){
  res.sendFile(path.join(__dirname+'/JWT2.html'));
});

app.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/JWT2.html'));
});

app.listen(4200);

console.log("Running at Port 4200");
