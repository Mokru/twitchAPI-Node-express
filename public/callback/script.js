function getState(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var state = getState('state');

if(state == "logged"){
    $.post("/", {code: getState('code'), request: "auth"}, function(data){
		if(data){
		var username = data[0].user_name;
		var authToken = data[0].authToken;
		document.getElementById("messages").innerHTML = "Hello " + username + "! You are now authorized.";
		
		var btn = document.createElement('button'),
			t = document.createTextNode('Get my follows list');
		btn.appendChild(t);
		btn.id = "getFollows";
		document.body.appendChild(btn);
		
		document.getElementById("getFollows").addEventListener("click", function(){
			$.post("/", {authToken: authToken, request: "follows", username: username}, function(data){
				$('#getFollows').hide();
				document.getElementById("messages").innerHTML = "Got your follows list right here!";
				console.log(data);
				var follows = data.follows;
				for(var i = 0; i < follows.length; i++){
					var obj = follows[i],
						channelDisp = obj.channel.display_name,
						channelLogo = obj.channel.logo;
						$('#content').append('<div class="casterRow"><img src="'+ channelLogo +'" style="width: 60px; height: 60px;"><h3 class="casterDisp">' + channelDisp +'</h3></div>');

				};
			})
		});
        console.log(data);
		};
    });
};
function updateLive(){
	
	$(".casterDisp").each(function() {
		var channelDisp = $(this).text();
		$.post("/", {request: "isLive", channel: channelDisp}, function(data){
			if(data.stream === null){
				$(".casterDisp:contains('"+channelDisp+"')").css( "color", "red" );
			}else{
				$(".casterDisp:contains('"+channelDisp+"')").css( "color", "green" );
			}
		})
	});
}
