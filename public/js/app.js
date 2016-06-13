
"use strict";

jQuery(document).ready(function() {

//var gauge = require('./gauge');
//var d3js = require('http://mbostock.github.com/d3/d3.js');


  var data = [0];
  var data_humid = [0];
  var data_temp = [0];
  var time = [0];
  var data_lux = [0];
  var Data_period = [0];
  var Data_Firm = [0];
  var Data_NodeID_1 = [0];
  var Data_NodeID_2 = [0];
  
  
  var period = 1;
  var Firm_Ver = '0.1.0';
  
    var MAX_DATA = 30;
  /* graph Related Variables */
  var color_temp = d3.scale.category10();
  color_temp.domain(['Sensor_temp']);
  var series_temp = color_temp.domain().map(function(name){
    return {
      name : 'Sensor_temp',
      values : data_temp
    };
  });
  
  
  var x_temp = null;
  var y_temp = null;
  var line_temp = null;
  var graph_temp = null;
  var xAxis_temp = null;
  var yAxis_temp = null;
  var ld_temp = null;
  var path_temp = null;
  /////////////////////////////////
    var color_humid = d3.scale.category10();
  color_humid.domain(['Sensor_humid']);
  var series_humid = color_humid.domain().map(function(name){
    return {
      name : 'Sensor_humid',
      values : data_humid
    };
  });
  
  
  var x_humid = null;
  var y_humid = null;
  var line_humid = null;
  var graph_humid = null;
  var xAxis_humid = null;
  var yAxis_humid = null;
  var ld_humid = null;
  var path_humid = null;
  ///////////////////////////////////////////////////
    var color_lux = d3.scale.category10();
  color_lux.domain(['Sensor_lux']);
  var series_lux = color_lux.domain().map(function(name){
    return {
      name : 'Sensor_lux',
      values : data_lux
    };
  });
  
  
  var x_lux = null;
  var y_lux = null;
  var line_lux = null;
  var graph_lux = null;
  var xAxis_lux = null;
  var yAxis_lux = null;
  var ld_lux = null;
  var path_lux = null;
    /* end of graph Related Variables */
  ///////////////////////////////////////////////////  
  
  var recent_ri = 0;
  var container_name = 'myContainer';
  var nodeID_1 = 'nodeID_1';
  var nodeID_2 = 'nodeID_2';
  
  var map = null;
  var valueLat = null;
  var valueLng = null;
  var valueAlt = null;
  
  // getConfig( function(err,config) {
    // if(data) container_name = config.containerName;
	// if(data) nodeID = config.nodeID;
  // });

  function hextodec(hex) {
    var final = 0;
    var letters = { a : 10, b : 11, c : 12, d : 13, e : 14, f : 15 };
    var len = hex.length;
    for(var i=0;i<len;i++) {
        var ch = hex.charAt(len-i-1);
        if( ch in letters )
            ch = letters[ch];
        var shiftBy = 4*i; 
        var sub = ch << shiftBy;
        final += sub;
    }
    return final;
  }

  function initMap() {
	//var myLatLng = {lat: valueLat, lng: valueLng};
	var myLatLng1 = {lat: 37.44, lng: 127.00};
	var myLatLng2 = {lat: 37.55, lng: 127.01};
	
	map = new google.maps.Map(document.getElementById('map'), {
	  center: myLatLng1,
	  zoom: 10
	});			
///////////////////////////////////////////
	  var contentString1 = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h4 id="firstHeading" class="firstHeading">LoRa Div-1</h4>'+
      '</div>';

  var infowindow1 = new google.maps.InfoWindow({
    content: contentString1
  });

var marker1 = new google.maps.Marker({
				position: myLatLng1,
				map: map,
				title: 'SKT LoRa Device',
				
				
	});	
  marker1.addListener('click', function() {
    infowindow1.open(map, marker1);
  });
///////////////////////////////////////////
	
	  var contentString2 = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h4 id="firstHeading" class="firstHeading">LoRa Div-2</h4>'+
      '</div>';

  var infowindow2 = new google.maps.InfoWindow({
    content: contentString2
  });

var marker2 = new google.maps.Marker({
				position: myLatLng2,
				map: map,
				title: 'SKT LoRa Device',
				
				
	});	
  marker2.addListener('click', function() {
    infowindow2.open(map, marker2);
  }); 
 ///////////////////////////////////////////
  } 
   ///////////////////////////////////////////
  function creategraph_temp(id) {
    color_temp.domain('Sensor_temp');
    var width = document.getElementById("graph_temp").clientWidth;
    var height = document.getElementById("graph_temp").clientHeight;
    var margin = {top: 10, right: 30, bottom: 20, left: 10};

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    // create the graph_temp object
    graph_temp = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x_temp = d3.scale.linear()
      .domain([0, MAX_DATA])
      .range([width, 0]);
    y_temp = d3.scale.linear()
      .domain([
        d3.min(series_temp, function(l) { return d3.min(l.values, function(v) { return v*0.75; }); }),
        d3.max(series_temp, function(l) { return d3.max(l.values, function(v) { return v*1.25; }); })
      ])
      .range([height, 0]);
    //add the axes labels
    graph_temp.append("text")
        .attr("class", "axis-label")
        .style("text-anchor", "end")
        .attr("x_temp", 100)
        .attr("y_temp", height)
        .text('Time');



    line_temp = d3.svg.line()
      .x(function(d, i) { return x_temp(i); })
      .y(function(d) { return y_temp(d); });

    xAxis_temp = graph_temp.append("g")
      .attr("class", "x_temp axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x_temp).orient("bottom"));

    yAxis_temp = graph_temp.append("g")
      .attr("class", "y_temp axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(d3.svg.axis().scale(y_temp).orient("right"));

    ld_temp = graph_temp.selectAll(".series_temp")
      .data(series_temp)
      .enter().append("g")
      .attr("class", "series_temp");

    // display the line by appending an svg:path element with the data line we created above
    path_temp = ld_temp.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line_temp(d.values); })
      .style("stroke", function(d) { return color_temp(d.name); });
  }

  function updategraph_temp() {
    // static update without animation
    y_temp.domain([
      d3.min(series_temp, function(l) { return d3.min(l.values, function(v) { return v*0.75; }); }),
      d3.max(series_temp, function(l) { return d3.max(l.values, function(v) { return v*1.25; }); })
    ]);
    yAxis_temp.call(d3.svg.axis().scale(y_temp).orient("right"));

    path_temp
      .attr("d", function(d) { return line_temp(d.values); })
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////
  function creategraph_humid(id) {
    color_humid.domain('Sensor_humid');
    var width = document.getElementById("graph_humid").clientWidth;
    var height = document.getElementById("graph_humid").clientHeight;
    var margin = {top: 10, right: 30, bottom: 20, left: 10};

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    // create the graph_humid object
    graph_humid = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x_humid = d3.scale.linear()
      .domain([0, MAX_DATA])
      .range([width, 0]);
    y_humid = d3.scale.linear()
      .domain([
        d3.min(series_humid, function(l) { return d3.min(l.values, function(v) { return v*0.75; }); }),
        d3.max(series_humid, function(l) { return d3.max(l.values, function(v) { return v*1.25; }); })
      ])
      .range([height, 0]);
    //add the axes labels
    graph_humid.append("text")
        .attr("class", "axis-label")
        .style("text-anchor", "end")
        .attr("x_humid", 100)
        .attr("y_humid", height)
        .text('Time');


    line_humid = d3.svg.line()
      .x(function(d, i) { return x_humid(i); })
      .y(function(d) { return y_humid(d); });

    xAxis_humid = graph_humid.append("g")
      .attr("class", "x_humid axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x_humid).orient("bottom"));

    yAxis_humid = graph_humid.append("g")
      .attr("class", "y_humid axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(d3.svg.axis().scale(y_humid).orient("right"));

    ld_humid = graph_humid.selectAll(".series_humid")
      .data(series_humid)
      .enter().append("g")
      .attr("class", "series_humid");

    // display the line by appending an svg:path element with the data line we created above
    path_humid = ld_humid.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line_humid(d.values); })
      .style("stroke", function(d) { return color_humid(d.name); });
  }

  function updategraph_humid() {
    // static update without animation
    y_humid.domain([
      d3.min(series_humid, function(l) { return d3.min(l.values, function(v) { return v*0.75; }); }),
      d3.max(series_humid, function(l) { return d3.max(l.values, function(v) { return v*1.25; }); })
    ]);
    yAxis_humid.call(d3.svg.axis().scale(y_humid).orient("right"));

    path_humid
      .attr("d", function(d) { return line_humid(d.values); })
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////
  function creategraph_lux(id) {
    color_lux.domain('Sensor_lux');
    var width = document.getElementById("graph_lux").clientWidth;
    var height = document.getElementById("graph_lux").clientHeight;
    var margin = {top: 10, right: 30, bottom: 20, left: 10};

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    // create the graph_lux object
    graph_lux = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x_lux = d3.scale.linear()
      .domain([0, MAX_DATA])
      .range([width, 0]);
    y_lux = d3.scale.linear()
      .domain([
        d3.min(series_lux, function(l) { return d3.min(l.values, function(v) { return v*0.75; }); }),
        d3.max(series_lux, function(l) { return d3.max(l.values, function(v) { return v*1.25; }); })
      ])
      .range([height, 0]);
    //add the axes labels
    graph_lux.append("text")
        .attr("class", "axis-label")
        .style("text-anchor", "end")
        .attr("x_lux", 100)
        .attr("y_lux", height)
        .text('Time');


    line_lux = d3.svg.line()
      .x(function(d, i) { return x_lux(i); })
      .y(function(d) { return y_lux(d); });

    xAxis_lux = graph_lux.append("g")
      .attr("class", "x_lux axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x_lux).orient("bottom"));

    yAxis_lux = graph_lux.append("g")
      .attr("class", "y_lux axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(d3.svg.axis().scale(y_lux).orient("right"));

    ld_lux = graph_lux.selectAll(".series_lux")
      .data(series_lux)
      .enter().append("g")
      .attr("class", "series_lux");

    // display the line by appending an svg:path element with the data line we created above
    path_lux = ld_lux.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line_lux(d.values); })
      .style("stroke", function(d) { return color_lux(d.name); });
  }

  function updategraph_lux() {
    // static update without animation
    y_lux.domain([
      d3.min(series_lux, function(l) { return d3.min(l.values, function(v) { return v*0.75; }); }),
      d3.max(series_lux, function(l) { return d3.max(l.values, function(v) { return v*1.25; }); })
    ]);
    yAxis_lux.call(d3.svg.axis().scale(y_lux).orient("right"));

    path_lux
      .attr("d", function(d) { return line_lux(d.values); })
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////

  function getConfig(cb) {
	  var nodeIndex = document.getElementById('NODEID').selectedIndex;
	  if(nodeIndex==1)
		var url = '/config_1';
	  else if(nodeIndex==2)
		var url = '/config_2';
	
    $.get(url, function(data, status){
      if(status == 'success'){
        cb(null, data);
      }
      else {
        console.log('[Error] /config API return status :'+status);
        cb({error: status}, null);
      }
    });
  }
 ///////////////////////////////////////////
 
 
  function getData(container, cb, timeValue, data_lux) {
    var url = '/data/' + container;
	
    $.get(url, function(data, status){
      if(status == 'success'){
        var valuePrim = data.con;
        var valueTime = data.ct;
		
		var valueDate = valueTime.substr(0, 10);
		var valueTimes = valueTime.substr(11, 8);
		valueTime = valueDate + " " + valueTimes;
		var valueLatHex = valuePrim.substr(16,6); // get Latitude value in Hex manner
		var valueLngHex = valuePrim.substr(22,6); // get Latitude value in Hex manner	
		var valueAltHex = valuePrim.substr(28,4);
        var valueHex = valuePrim.substr(14,1); // get (a,b) means substract b characters from a point
		valueLat = hextodec(valueLatHex)/100000;
		valueLng = hextodec(valueLngHex)/100000;
		valueAlt = hextodec(valueAltHex);
        var value = hextodec(valueHex);
		//value = 00000000000000b939526cc1c39700b9;
        var ri = parseInt(data.ri.slice(2, data.ri.length));
        if(ri > recent_ri){
          recent_ri = ri;
        }
        cb(null, valueLat, valueLng, valueAlt, valueTime, valuePrim);
      }
      else {
        console.log('[Error] /data API return status :'+status);
        cb({error: status}, null);
      }
    });
  }

  function displayData() {
    $('#temp_value')[0].innerText = data_temp[0];
	//$('#temp_value_lng')[0].innerText = data_temp[0];
    //$('#temp_time')[0].innerText = new Date().toLocaleString();
	$('#humid_value')[0].innerText = data_humid[0];
    //$('#estimatedTime')[0].innerText = time[0];
    $('#lux_value')[0].innerText = data_lux[0];
	$('#FirmVer_value')[0].innerText = Data_Firm[0];
	$('#NodeID_1')[0].innerText = Data_NodeID_1[0];
	$('#NodeID_2')[0].innerText = Data_NodeID_2[0];
  }
  function insertNewData(value){
    if(data.length == MAX_DATA){
      data.pop();
    }
    data.splice(0,0,value);
  }
  
  function insertNewData_temp(value){
    if(data_temp.length == MAX_DATA){
      data_temp.pop();
    }
    data_temp.splice(0,0,value);
  }
  
  function insertNewData_humid(value){
    if(data_humid.length == MAX_DATA){
      data_humid.pop();
    }
    data_humid.splice(0,0,value);
  }
  function insertNewTime(value){
    if(time.length == MAX_DATA){
      time.pop();
    }
    time.splice(0,0,value);
  }

  function insertNewdata_lux(value){
    if(data_lux.length == MAX_DATA){
      data_lux.pop();
    }
    data_lux.splice(0,0,value);
  }
  
  function insertNewData_period(value){
    if(Data_period.length == MAX_DATA){
      Data_period.pop();
    }
    Data_period.splice(0,0,value);
  }
  
    function insertNewData_FrimVer(value){
    if(Data_Firm.length == MAX_DATA){
      Data_Firm.pop();
    }
    Data_Firm.splice(0,0,value);
  }
  
      function insertNewData_NodeID_1(value){
    if(Data_NodeID_1.length == MAX_DATA){
      Data_NodeID_1.pop();
    }
    Data_NodeID_1.splice(0,0,value);
  }
        function insertNewData_NodeID_2(value){
    if(Data_NodeID_2.length == MAX_DATA){
      Data_NodeID_2.pop();
    }
    Data_NodeID_2.splice(0,0,value);
  }
  
  function initToastOptions(){
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-bottom-full-width",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "3000",
      "hideDuration": "10000",
      "timeOut": "2000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  }
  
  initToastOptions();
  creategraph_temp('#graph_temp');
  creategraph_humid('#graph_humid');
  creategraph_lux('#graph_lux');
  

   initMap();
  setInterval(function(){
    getData(container_name, function(err,data,data_lng, data_alt, time,data_prim){
      insertNewData(data);
      insertNewTime(time);
	  
	  var valueTemp = data_prim.substr(0,2);
	  var valueHumid = data_prim.substr(3,2);
	  var valueLux = data_prim.substr(6,2);
	  
      insertNewData_temp(valueTemp);
	  insertNewData_humid(valueHumid);
	  insertNewdata_lux(valueLux);
	  
	 //////////////////////////////////
    });
	insertNewData_FrimVer(Firm_Ver);
	insertNewData_NodeID_1(nodeID_1);
	
	insertNewData_NodeID_2(nodeID_2);
	//initMap();
    displayData();
    updategraph_temp();
	updategraph_humid();
	updategraph_lux();
	
	getConfig( function(err,config) {
		if(data) container_name = config.containerName;
		var nodeIndex = document.getElementById('NODEID').selectedIndex;
		//nodeID_1 = config.nodeID;
		if(data){
			if(nodeIndex==1){
				nodeID_1 = config.nodeID;
			//insertNewData_NodeID_1(config.nodeID);
			}
			else if(nodeIndex==2){
				nodeID_2 = config.nodeID;
				//insertNewData_NodeID_2(config.nodeID);
			}
		}
	});
  }, period*1000);
  

     var mapInterval = setTimeout(function(){initMap()}, 500);


  
  $('#DevReset').on('click', function(event) {
    $.post('/control',{cmt:'DevReset', cmd:'request'}, function(data,status){
      toastr.success('Device Reset');
      console.log(data);
    });
  });
  $('#RepPerChange').on('click', function(event) {
    $.post('/control', {cmt:'RepPerChange', cmd: document.getElementById('input_value').value}, function(data,status){
      toastr.info('Period Changed');
      console.log(data);
	  period=document.getElementById('input_value').value;
    });
  });
  $('#RepImmediate').on('click', function(event) {
    $.post('/control', {cmt:'RepImmediate',cmd:'request'}, function(data,status){
      toastr.warning('LED ON');
      console.log(data);
	  Firm_Ver = '1.0.0';
    });
  });
///////////////////////////////////////////////////////////////////////////////////////////////////
/* 				
			var gauges = [];
			
			function createGauge(name, label, min, max)
			{
				var config = 
				{
					size: 120,
					label: label,
					min: undefined != min ? min : 0,
					max: undefined != max ? max : 100,
					minorTicks: 5
				}
				
				var range = config.max - config.min;
				config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
				config.redZones = [{ from: config.min + range*0.9, to: config.max }];
				
				gauges[name] = new Gauge(name + "GaugeContainer", config);
				gauges[name].render();
			}
			
			function createGauges()
			{
				createGauge("memory", "Memory");
				createGauge("cpu", "CPU");
				createGauge("network", "Network");
				//createGauge("test", "Test", -50, 50 );
			}
			
			function updateGauges()
			{
				for (var key in gauges)
				{
					var value = getRandomValue(gauges[key])
					gauges[key].redraw(value);
				}
			}
			
			function getRandomValue(gauge)
			{
				var overflow = 0; //10;
				return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
			}
			
			function initialize()
			{
				createGauges();
				setInterval(updateGauges, 5000);
			} */
});
