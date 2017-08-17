// Get the scheduling cron module
const cron = require('node-cron');
// And the request module
const request = require('request');

// Import the module that communicates with Slack, and the one that sends email
const slack = require('./slack.js');

// Some useful constants and stored messages
const harrowDown = "The Harrow campus stream is down. \n<http://streaming.smokeradio.co.uk:8080|Check status>";
const hubDown = "The Media Hub stream is down. Has someone closed the playout software? \n<http://streaming.smokeradio.co.uk:8080|Check status>";
const mainDown = "The main /listen radio stream is down. Airtime may be experiencing a problem. \n<http://streaming.smokeradio.co.uk:8080|Check status>";
const icecastUrl = "http://streaming.smokeradio.co.uk:8080/status-json.xsl";

// Function to call the Icecast API and get a list of active mountpoints
function retrieveStatus(){
  request(icecastUrl, function (error, response, body) {
    // If error, log it
    var mountpointList = JSON.parse(body).icestats.source;
    // Check for all three mountpoints
    checkStatus(mountpointList, 'listen');
    checkStatus(mountpointList, 'hub');
    checkStatus(mountpointList, 'harrow');
  });
}

// Function to check whether a given mountpoint is up, and if it isn't, send a slack message
function checkStatus(mountpointList, streamToCheck){
  var needle = mountpointList.find(function(mountpoint){
    if(mountpoint.listenurl == "http://77.68.10.108:8080/" + streamToCheck){
      return true;
    }
  })
  // test whether the mountpoint was found
  if (typeof(needle) === 'object') {
    console.log('Mountpoint up!');
  } else {
    console.log('Mountpoint is down! Sending slack message...');
    if (streamToCheck == "listen") {
          slack.send(mainDown);
    } else if(streamToCheck == "hub"){
          slack.send(hubDown);
    } else if(streamToCheck == "harrow"){
          slack.send(harrowDown);
    }
  }
}

// Initial check on startup
retrieveStatus();

// Schedule daily checks
cron.schedule('* 12 * * *', function(){
  retrieveStatus();
});
