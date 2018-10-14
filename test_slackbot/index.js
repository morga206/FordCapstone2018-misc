const SlackBot = require('slackbots');  // slackbot
const axios = require('axios');         // Axios for getting URL's
const url = ('url');                    // URL's
const endpoint = "https://xi0qsb2rpi.execute-api.us-east-2.amazonaws.com/friesen3/stats"



const bot = new SlackBot({
    token: 'xoxb-430270326289-432202662470-pZEUZZ8OaRaoWOftr4JfWpAm',
    name: 'SentimentBot'
});


// Start Handler
bot.on('start', function () {
    var params = {
        "appIdStore": "com.ford.fordpass*App Store",
        "version": "1.19.2",
        "startDate": "2018-04-10T00:00:00.000Z",
        "endDate": "2018-06-12T00:00:00.000Z",
        "stats": [{
            "rawReviews": null
        }]
    };

    axios.post(endpoint, params)
        .then(function (response) {
            let rawReviews = response.data.stats[0].rawReviews;

            let message = ""
            for (var review in rawReviews) {
                message += "Review\n\tappIdStore: ";
                message += JSON.parse(rawReviews[review]).appIdStore;
                message += "\n\tversion: ";
                message += JSON.parse(rawReviews[review]).version;
                message += "\n\tdate: ";
                message += JSON.parse(rawReviews[review]).date;
                message += "\n\t"
                message += "\n\n"
            }
            console.log(message);
            let emoticon_params = {
                icon_emoji: ':wave'
            }
            bot.postMessageToChannel('general', message, emoticon_params);

        })
        .catch(function (error){
            console.log(error);
        });


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
    console.log(message)
    /// Did the message call the reviews function?
    if (message.includes('reviews')){
        var arguments = message.split(' ');
        console.log(arguments)
        console.log("arguments")
        var startDate = arguments[2].split('-');
        var endDate = arguments[3].split('-');

        var startParam = startDate[2] + '-' + startDate[0] + '-' + startDate[1] + "T00:00:00.000z";
        var endParam = endDate[2] + '-' + endDate[0] + '-' + endDate[1] + "T00:00:00.000z";

        let params = {
            "appIdStore": "com.ford.fordpass*App Store",
            "version": "2.4.1",
            "startDate": startParam,
            "endDate": endParam,
            "stats": [{
                "rawReviews": null
            }]
        };

        axios.post(endpoint, params)
            .then(function (response) {
                let rawReviews = response.data.stats[0].rawReviews;

                let slackMessage = ""
                for (var review in rawReviews) {
                    slackMessage += "Review\n\tappIdStore: ";
                    slackMessage += JSON.parse(rawReviews[review]).appIdStore;
                    slackMessage += "\n\tversion: ";
                    slackMessage += JSON.parse(rawReviews[review]).version;
                    slackMessage += "\n\tdate: ";
                    slackMessage += JSON.parse(rawReviews[review]).date;
                    slackMessage += "\n\tneutral sent: ";
                    slackMessage += JSON.parse(rawReviews[review]).neuSentiment
                    slackMessage += "\n\tcompound sent: ";
                    slackMessage += JSON.parse(rawReviews[review]).compSentiment;
                    slackMessage += "\n\tpos sent: ";
                    slackMessage += JSON.parse(rawReviews[review]).posSentiment;
                    slackMessage += "\n\tneg sent: ";
                    slackMessage += JSON.parse(rawReviews[review]).negSentiment;
                    slackMessage += "\n\t"
                    slackMessage += "\n\n"
                }
                console.log(slackMessage);
                let emoticon_params = {
                    icon_emoji: ':wave'
                }
                bot.postMessageToChannel('general', slackMessage, emoticon_params);

            })
            .catch(function (error){
                console.log(error);
            });
    }
    /// Did the message call for --help?
    else if(message.includes('-help')){
        helpMessage();
    }


};


/**
 * Function displays a help message to help slack users utilize bot
 */
function helpMessage(){
    var message = "\nRequest format: \"@testbot request_reviews mm-dd-yyyy mm-dd-yyyy\"" +
        "\n Where the dates are startDate, endDate accordingly."

    var params = {
        icon_emoji: ':thinking_face:'
    };

    bot.postMessageToChannel('general', `Here is what I can do ${message}`,params);
}