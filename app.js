

/**
 * #blametim Twitter Bot
 * Negative tweets in London, just #blametim
 * https://twitter.com/_blametim
 */

/**
 * Module dependencies.
 */

var Twit = require('twit'); // Twitter API client - https://github.com/ttezel/twit 
var sentiment = require('sentiment'); // AFINN-based sentiment analysis for Node.js - https://github.com/thisandagain/sentiment
var keys = require('./keys.js'); // Local Twitter API keys

/**
* Keys saved in keys.js as variables: 
* keys_consumer_key = 'xxxxxxxxxxxxxxxxxxxxxxxxx',
* keys_consumer_secret ='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
* keys_access_token = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
* keys_access_token_secret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
*/

var T = new Twit({
    consumer_key:         keys_consumer_key
  , consumer_secret:      keys_consumer_secret
  , access_token:         keys_access_token
  , access_token_secret:  keys_access_token_secret
});

var london = ['-0.489', '51.28' ,'0.236', '51.686']; //London's latitude/longitude bounded box
var stream = T.stream('statuses/filter', { language: 'en', locations: london }) // Filter by English language and in London
var accountScreenName = '_blametim' // The screenname of the account your using, used to prevent looping of it's own tweets.
var accountComment = '#blametim'    // The comment you want to add after the tweet

stream.on('tweet', function (tweet) {
  var tweetSentiment = sentiment(tweet.text); // Run sentiment analysis on tweet
  var fullTweet = ('RT @' + tweet.user.screen_name + ' "' + tweet.text + '" ' + accountComment); // The full tweet for readablity and to check character length
  // Setting conditions. Sentiment less than -3, length of tweet less than 140 characters and that the tweet is not coming from this account
  if(tweetSentiment.score < -3 && fullTweet.length < 140 && tweet.user.screen_name != accountScreenName ){ 
    T.post('statuses/update', { status: fullTweet }, function(err, data, response) { // Posts the tweet as a 'status'
	  if (err){
	    console.log(err) // Response if there's an error
	  }
  	  console.log('@' + accountScreenName + ': ' + fullTweet); //If successful, console logs the account and tweet posted
	})
  } 
})


