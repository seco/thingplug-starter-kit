'use strict';

var colors = require('colors');
var xml2js = require('xml2js');
var async = require('async');

var config = require('./config_2');
var api = require('./lib/api');
var MQTTClient = require('./lib/mqtt_client');

var IntervalFunction;
var UPDATE_CONTENT_INTERVAL = 1000;
var BASE_TEMP = 30;
var BASE_HUMID = 60;
var BASE_LUX = 80;


console.log(colors.green('### ThingPlug Device###'));
if(typeof config === 'undefined') {
  return console.log(colors.red('먼저 config.js를 열어 optionData를 설정하세요. README.md에 Starterkit 실행 방법이 설명되어 있습니다.'));
}

async.waterfall([
  function createNode(cb){
    console.log(colors.blue('1. node 생성 요청'));
    api.createNode(config.nodeID, cb);
  },
  function createRemoteCSE(nodeRI, cb){
    console.log(colors.blue('2. remoceCSE 생성 요청'));
    config.nodeRI = nodeRI;
    api.createRemoteCSE(config.nodeID, config.nodeRI, config.passCode, cb);
  },
  function createContainer(dKey, cb){
    console.log(colors.blue('3. container 생성 요청'));
    config.dKey = dKey;
    api.createContainer(config.nodeID, config.containerName, dKey, cb);
  },
  function createDevReset(res, cb){
    console.log(colors.blue('4. DevReset 생성 요청'));
    var mgmtCmd = config.nodeID+'_'+config.DevReset;
    api.createMgmtCmd(mgmtCmd, config.dKey, config.DevReset, config.nodeRI, cb);
  },
  function createRepPerChange(res, cb){
    console.log(colors.blue('4. RepPerChange 생성 요청'));
    var mgmtCmd = config.nodeID+'_'+config.RepPerChange;
    api.createMgmtCmd(mgmtCmd, config.dKey, config.RepPerChange, config.nodeRI, cb);
  },
  function createRepImmediate(res, cb){
    console.log(colors.blue('4. RepImmediate 생성 요청'));
    var mgmtCmd = config.nodeID+'_'+config.RepImmediate;
    api.createMgmtCmd(mgmtCmd, config.dKey, config.RepImmediate, config.nodeRI, cb);
  }
  
], function processResult (err, result) {
    if(err){
      console.log('Registration Failure: ');
      return console.log(err);
    }
    console.log(colors.green('5. content Instance 주기적 생성 시작'));
    IntervalFunction = setInterval(IntervalProcess, UPDATE_CONTENT_INTERVAL);

    console.log(colors.green('6. 제어 명령 수신 MQTT 연결'));
    var mqttClient = new MQTTClient(config.nodeID);
    mqttClient.on('message', function(topic, message){
      var msgs = message.toString().split(',');
      console.log(colors.red('#####################################'));
      console.log(colors.red('MQTT 수신'));
      xml2js.parseString( msgs[0], function(err, xmlObj){
        if(!err){
          console.log(xmlObj['m2m:req']['pc'][0]['exin'][0]['ri'][0]);//EI000000000000000
		  console.log(xmlObj['m2m:req']['pc'][0]['exin'][0]['cmt'][0]);//Type
          console.log(xmlObj['m2m:req']['pc'][0]['exin'][0]['exra'][0]);//CMD : 
          try{
            var req = JSON.parse(xmlObj['m2m:req']['pc'][0]['exin'][0]['exra'][0]);
			var cmt = xmlObj['m2m:req']['pc'][0]['exin'][0]['cmt'][0];
          }
          catch(e){
            console.error(xmlObj['m2m:req']['pc'][0]['exin'][0]['exra'][0]);
            console.error(e);
          }
          processCMD(req, cmt);
          var ei = xmlObj['m2m:req']['pc'][0]['exin'][0]['ri'][0];
          api.updateExecInstance(config.nodeID, config.mgmtCmdPrefix, config.dKey, ei);//TBD. cmd에 맞는 명령 보내기
        }
      });
      console.log(colors.red('#####################################'));
    });
});

 function IntervalProcess(){
      var value_TEMP = Math.floor(Math.random() * 5) + BASE_TEMP;
	  var value_HUMID = Math.floor(Math.random() * 5) + BASE_HUMID;
	  var value_LUX = Math.floor(Math.random() * 5) + BASE_LUX;
      api.createContentInstance(config.nodeID, config.containerName, config.dKey, value_TEMP.toString()+","+value_HUMID.toString()+","+value_LUX.toString());
    }

function processCMD(req, cmt){
  if(req.cmd === 'request'){
    BASE_TEMP = 10;
  }
  else{
    console.log('cmd: ' + req);
	UPDATE_CONTENT_INTERVAL = req.cmd*1000;
	console.log('UPDATE_CONTENT_INTERVAL: ' + UPDATE_CONTENT_INTERVAL);
	clearInterval(IntervalFunction);
	IntervalFunction = setInterval(IntervalProcess, UPDATE_CONTENT_INTERVAL);
	
	BASE_TEMP = 30;
  }
}
