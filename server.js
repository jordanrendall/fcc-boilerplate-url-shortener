'use strict';
const dotenv = require('dotenv').config({ path: './.env' })

const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors');
const dns = require('dns');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;
const con = mongoose.connect(process.env.MONGO_URI)
.then((result)=>{
  console.log('Connected with: '+result.connection.user);
})
.catch((err)=>{
    console.log('Error: '+err);
});


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
  const https = /http(s)?:\/\//;
  let url = req.body.url;
  
  if(!https.test(url)){
    url = 'https://' + url;
  }

  let domain = url.replace(https,'');

  dns.lookup(domain,function(err,address){
    if(err){
    }else{
      let urlNum = Url.count(function(err,count){
        let entry = new Url({originalUrl: url, shortUrl:count+1})
        .save(function(err,data){
          if(err){
          } 
          else{
            console.log(`URL: ${data.originalUrl} #: ${data.shortUrl}`);
          }
        });
      });
    }
  }); 
})

app.get('/api/shorturl/:id',function(req,res){
  let id = req.params.id;
  let findResult = Url.find({shortUrl: id},function(err,data){
      if(err){
        res.json('Not found.');
      }
      else{
        res.redirect(data[0].originalUrl);
      }
  });
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});