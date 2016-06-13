'use strict';

var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var config = require('./config');
var config_1 = require('./config_1');
var config_2 = require('./config_2');
var api = require('./lib/api');

app.set('port', process.env.PORT || 3000);
app.use('/dashboard', express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/config_1', function(req,res) {
	config = config_1;
  res.send(config);
});

app.get('/config_2', function(req,res) {
	config = config_2;
  res.send(config);
});

app.get('/data/:container', function(req,res) {
  var container = req.params.container;
 
  api.getLatestContainer(config.nodeID, container, function(err, data){
    if(err) return res.send(err);
    else return res.send(data.cin);
  });
});

app.post('/control', function(req,res) {
  var cmd = JSON.stringify(req.body);
  console.log("{\"cmd\":\""+req.body.cmd+"\"}");
  api.reqMgmtCmd(config.nodeID, req.body.cmt, "{\"cmd\":\""+req.body.cmd+"\"}", config.nodeRI, function(err, data){
    if(err) return res.send({'error':err});
    return res.send({'result':'ok'});
  });
});


var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server for sample dashboard listening on port:'+ app.get('port'));
});
