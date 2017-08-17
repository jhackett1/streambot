//Get the request module
const request = require('request');

// Send a specified message to a specified Slack webhooks url
function sendMessage(message){
  const url = "";
  request({
      url: url,
      method: "POST",
      json: true,
      headers: {
          "content-type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({"text": message})
  }).on('response', function(response) {
    // If server responds...
    console.log(response.statusCode + ": " + response.statusMessage)
  })
  .on('error', function(err) {
    // If server doesn't respond...
    console.log(err)
  })
}

module.exports = {
  send: function(message){
      sendMessage(message)
  }
}
