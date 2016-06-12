var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mqtt = require('mqtt');

var MQTTClient = function(nodeID){
  if(!(this instanceof MQTTClient)){
    return new MQTTClient(nodeID);
  }
  var self = this;

  var client = mqtt.connect('mqtt://211.115.15.160', {
	username:'admin02',
	password:'admin02'
  });
	client.on('connect', function () {
		console.log('### mqtt connected ###');
		//client.subscribe("/oneM2M/req/+/+");
		client.subscribe("/oneM2M/req/+/"+ nodeID);		
		client.subscribe("/oneM2M/resp/"+ nodeID +"/+");
		//client.publish("/oneM2M/req/"+ nodeID +"/ThingPlug");
	});
  client.on('close', function(){
		console.log('### mqtt disconnected ###');
  });
  
	client.on('error', function(error){
    self.emit('error', error);
  });

	client.on('message', function(topic, message){
    self.emit('message', topic, message);
  });
  EventEmitter.call(this);
};
util.inherits(MQTTClient, EventEmitter);

module.exports = MQTTClient;
