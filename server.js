const express = require('express');
const app = express();
var http = require('http'),
	 twitchAPI = require('twitch-api');



var twitch = new twitchAPI({
    clientId: 'id',
    clientSecret: 'secret',
    redirectUri: 'http://localhost:3000/callback',
    scopes: ['user_read']
  });


const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/', function (req, res) {
	console.log('Got post request: ' + req.body.request);
	
	if(req.body.request == "auth"){
	
	var code = req.body.code;
	twitch.getAccessToken(code, function(err, body){
    if (err){
      console.log(err);
    } else {
      /*
      * body = {
      *   access_token: 'your authenticated user access token',
      *   scopes: [array of granted scopes]
      * }
      */
	authToken = body.access_token
	console.log("got access token: " + authToken);
	
	twitch.getRoot(body.access_token, function(err, data){
			console.log("the user is " + data["token"]["user_name"]);
			userName = data["token"]["user_name"]
			,
			resData = [{user_name: userName, authToken: authToken}];
			res.json(resData);

		});
	
	  }
    
	});
	}else if(req.body.request == "follows"){
		  var username = req.body.username;
		  var authToken = req.body.authToken;
		  console.log("User " + username + " requesting follows with " + authToken);
		  twitch.getUserFollowedChannels(username,{sortby: "last_broadcast"}, function(err,data){
			  res.json(data);
		  });
	  }else if(req.body.request == "isLive"){
		  var channel = req.body.channel;
		  console.log("checking if " + channel + " is live");
		  twitch.getChannelStream(channel, function(err,data){
			  res.json(data);
		  });
	  }

});
	

app.listen(process.env.PORT || 3000, function () {
    console.log('server up');
	
});

app.use(express.static('public'));
