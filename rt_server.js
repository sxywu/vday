var _ = require('lodash');
var Twit = require('twit');
var five = require("johnny-five");
    
var board = new five.Board();
var T = new Twit({
  // fill with keys 
  consumer_key: '5nfSOlUowKhWrUYHNjZK1Lb6z',
  consumer_secret: 'tR5LeolMR4z9WrOa8qoDsA7nvHAk2vfDDRjWdrVIa5MOGyGI0z',
  access_token: '190857410-AWDGbKSE8LJVjXAOg7AK4ZgSK4raFivBsoQiPTDA',
  access_token_secret: 'Uz6gGKjA9dlf4RJpBicM2WUbo1wcb3BV5rQZ76N9rsYpo'
});
var vday = T.stream('statuses/filter', { track: "Happy Valentine's Day" });
var single = T.stream('statuses/filter', { track: "#WhyImSingle" });

var range = 6;
var timer = 100;
var redPin = 2;
var bluePin = 8;
var redVal = 0;
var blueVal = 0;
var lightLed = function(type, val) {
  _.each(_.range(range), function(i) {
    var output = 0;
    var pin = (type === 'red' ? redPin : bluePin) + i;
    if (i < val) {
      output = 1;
    }
    board.digitalWrite(pin, output);
  });
}
var tweetin = function(type) {
  // when we get a tweet, and we haven't turned all the led's on
  // add on to redVal, and turn that many on
  if (type === 'red') {
    if (redVal < range - 1) {
      redVal += 1;
      lightLed(type, redVal);
    }
  } else {
    if (blueVal < range - 1) {
      blueVal += 1;
      lightLed(type, blueVal);
    }
  }
  
}
var tweetout = function(type) {
  setTimeout(function() {
    if (type === 'red') {
      if (redVal > 0) {
        redVal -= 1;
        lightLed(type, redVal);
      }
    } else {
      if (blueVal > 0) {
        blueVal -= 1;
        lightLed(type, blueVal);
      }
    }
    
  }, timer);
}

board.on("ready", function() {
  console.log("Ready!");

  // set pin mode for all the pins
  _.each(_.range(range), function(i) {
    board.pinMode(redPin + i, five.Pin.OUTPUT);
    board.pinMode(bluePin + i, five.Pin.OUTPUT);
  });

  vday.on('tweet', function(json) {
    console.log('\n\n**************************************');
    console.log(json.text);

    tweetin('red');
    tweetout('red');
  });

  single.on('tweet', function(json) {
    console.log('\n\n--------------------------------------');
    console.log(json.text);

    tweetin('blue');
    tweetout('blue');
  });
});
