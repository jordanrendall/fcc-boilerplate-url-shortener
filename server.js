'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cors = require('cors');
var dns = require('dns')

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI);

let UrlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: Number
});

let Url = mongoose.model('Url',UrlSchema);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post('/api/shorturl/new',function(req,res){
  let url = req.body.url;
  let urlNum = Url.count(function(err,data){
    let entry = new Url({originalUrl: url, shortUrl:urlNum+1})
    .save(function(err,data){
      if(err) console.log('Error saving new entry: '+ err);
    });
  });
  
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});