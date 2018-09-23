const SlackBot = require('slackbots');  // slackbot
const axios = require('axios');         // Axios for getting URL's
const url = ('url');                    // URL's
const its = require('app-store-scraper');
const gplay = require('google-play-scraper');


const bot = new SlackBot({
    token: 'xoxb-430270326289-432202662470-pZEUZZ8OaRaoWOftr4JfWpAm',
    name: ''
});

// Start Handler
bot.on('start', function() {
    var params = {
        icon_emoji: ':spock-hand:'
    };

    var app_ids = [1095418609,587040067,599142823];
    var id_num;
    for(id_num in app_ids){
        //console.log(app_ids[id_num])
        its.app({
            id: app_ids[id_num]
        })
            .then(res => {
                ///console.log(res)
            })
            .catch()
    }


    its.reviews({
        appId: 'com.ford.FordRemoteAccess',
        page: 1
    })
        .then( res => {
            console.log;
        })
        .catch(console.log);

    var params = {
        icon_emoji: ':100:'
    };

    var message = "SENTIMENT REPORT:\n" +
        "\tIn the last week we've seen 12 new Reviews on the \"Ford Remote Access\" App!\n" +
        "\tAverage sentiment rating of 0.9643 - positive (+0.013 from last week)\n\n" +
        "Of the 12 Reviews:\n" +
        "\t2 were very positive!\n" +
        "\t5 were positive!\n" +
        "\t3 were neutral" +
        "\t1 was negative" +
        "\t1 was very negative\n\n" +
        "Top 5 keywords in Positive reviews:\n" +
        "\t1. Ford\n" +
        "\t2. fast\n" +
        "\t3. start\n" +
        "\t4. system\n" +
        "\t5. great\n\n" +
        "Top 5 keywords in Negative reviews:\n" +
        "\t1. update\n" +
        "\t2. installed\n" +
        "\t3. bug\n" +
        "\t4. errors\n" +
        "\t5. timer\n";

    bot.postMessageToChannel('general', message, {icon_emoji: ':100:'});

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

    /// Did the message call the reviews function?
    if (message.includes(' reviews(')){

        var parenthesis = message.substring(message.indexOf(' reviews('));
        var parameters_string = parenthesis.substring(9,parenthesis.indexOf(')'));
        var parameters_array = parameters_string.trim().split(',');

        reviews(parameters_array[0].trim(),parameters_array[1].trim(),parameters_array[2].trim(),parameters_array[3].trim());
    }
    /// Did the message call for --help?
    else if(message.includes('--help')){
        helpMessage();
    }


};

function mockupMessage(){
    var params = {
        icon_emoji: ':oncoming_automobile:'
    };


    var message = "Here is the most recent Review for Ford Remote Access\n\n" +
        "text:\n" +
        "\tGreat system. Had Installed on my 2016 F-150. Works better than dealer explained. From\n" +
        "\tthe time I press the START button until the time I get the confirmation is like 2 seconds!!\n" +
        "\tThis system is many times faster than the OnStar system I had on my Yukon. That piece of\n" +
        "\tjunk, when it worked, took like 45 seconds to send a command. Garbage. Also, the Ford\n" +
        "\tRemote Access includes a GREAT shock sensor security system that texts and emails me\n" +
        "\tinstantly when the alarm trips. GREAT SYSTEM!!!!\n\n" +
        "sentiment rating:\n" +
        "\t0.9845 (0.0432 more than the average for this app"
    bot.postMessageToChannel('general', `${message}`,params);
}

/** Example function that tells a chuck norris joke
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
*/
/**
 *
 * @param id: id number of app
 */
function fetchAppleReviews(id, reviews, version_num, page_num){

    var collection = [];

    its.reviews({
        id: id,
        page: page_num
    })
        .then(ans => {

            /// For each review on the current page we're scraping
            for(var review in ans){
                console.log(review);

                // Add the review to our collection
                if(ans[review].version === version_num){
                    reviews.push(ans[review]);
                }
            }

            // Recursive call to fill array with reviews matching wanted version number
            if(page_num < 9){
                fetchAppleReviews(id, reviews, version_num, page_num+1);
            }

        })
        .catch(console.log);



}

/**
 *  Function that gets called when "@testbot reviews()"
 *  is messaged in slack when the bot is on
 *
 *  Displays data about the most recent n reviews of an app
 *
 * @param store (char) 'G' for google play, 'A' for Apple
 * @param id, (int) id of the app
 * @param version, (string) version number of app
 * @param n, (int) number of reviews to get
 */
function reviews(store, id, version, n){


    id = parseInt(id);
    var message = "";
    var reviews_raw = [];

    // Search Google store
    if(store == 'G'){
        console.log("Searching Google Store")
    }
    // Search Apple store
    else if(store == 'A'){
        console.log("Searching Apple Store")

        // Get the app
        its.app({
            id: id
        })
            .then(res => {
                if(version == 'latest'){
                    version = res.version; /// If message said "latest" set version
                }

            })
            .catch(console.log);

        // Get the reviews
        its.reviews({
            id: id,
            page: 1
        })
            .then(ans => {
                for(var i in ans){
                    if(ans[i].version === version){
                        reviews_raw.push(ans[i]);
                    }
                }
                console.log(reviews_raw.length);
            })


        //fetchAppleReviews(id, version, 1)
          //  .then(reviews => {
            //    console.log("Line 169");
              //  console.log(reviews.length);
            //})
            //.catch(console.log);



        var params = {
            icon_emoji: ':oncoming_automobile:'
        };


        //bot.postMessageToChannel('general', `${message}`,params);
        //bot.postMessageToChannel('general', `Average Rating over the last ${n} reviews: ${recent_ratings}`, params);

    }


}

/**
 * Function displays a help message to help slack users utilize bot
 */
function helpMessage(){
    var message = "\n1. Reviews(char store, int id, string version, int n)\n" +
        "\t\tParameters:\n\t\t\tstore: {'a' or 'g'}\n" +
        "\t\t\tid: integer id for app\n\t\t\tversion: version number or {'latest'}\n" +
        "\t\t\tn: n most recent reviews\n" +
        "\t\tExample:\n\t\t\t\t '@testbot review('apple', xxxxxxxxx, \'latest\', 20)'\n"

    var params = {
        icon_emoji: ':thinking_face:'
    };

    bot.postMessageToChannel('general', `Here is what I can do ${message}`,params);
}