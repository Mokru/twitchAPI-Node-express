function authRedi(){
    window.location.replace("https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=ptuhe77jcqonxnfm98294sv0amjglt5&redirect_uri=http://localhost:3000/callback&scope=user_read&state=logged");
};