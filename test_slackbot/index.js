const SlackBot = require('slackbots');
const axios = require('axios');
const url = ('url');

const bot = new SlackBot({
    token: 'xoxb-430270326289-432202662470-pZEUZZ8OaRaoWOftr4JfWpAm',
    name: ''
});

// Start Handler
bot.on('start', function() {
    var params = {
        icon_emoji: ':spock-hand:'
    };

    bot.postMessageToChannel('general', 'Hello World, I come in Peace', params);

});

// Error Handler
bot.on('error', (err) => console.log(err));

// Message Handler
bot.on('message', (data) => {

    if(data.type !== 'message') {
        return;
    }

    handleMessage(data.text);

});

// Response to Data
function handleMessage(message){
    if(message.includes(' chucknorris')){
        chuckNorrisJoke();
    }
    // User asked for app
    else if(message.includes('app_search')){
        var id = message.substring(message.indexOf('id='));
        var appID = id.substring(3);

        // google play store
        if(message.includes(' google')){

        }
        // itunes store
        else{
            appleSearchById(appID);
        }
    }

};

//
function appleSearchById(appId){
    var parsed = 'https://itunes.apple.com/lookup?id=' + appId;
    axios.get(parsed)
        .then(res => {
            var appName = res.data.results[0].trackName;
            var params = {
                icon_emoji: ':100:'
            };
            console.log(res.data.results[1]);
            console.log("----------------------");
            console.log(res.data.results[2]);
            console.log("----------------------");
            console.log(res.data.results[0]);

            bot.postMessageToChannel('general', `App Name: ${appName}`, params);
        })

}


// Tell a Chuck Norris Joke
function chuckNorrisJoke() {
    axios.get('http://api.icndb.com/jokes/random')
        .then(res => {
            var joke = res.data.value.joke;

            var params = {
                icon_emoji: ':100:'
            };

            bot.postMessageToChannel('general', `Joke Incoming? ${joke}`, params);

        })
}