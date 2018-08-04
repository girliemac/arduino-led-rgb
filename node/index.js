var five = require('johnny-five');
var PubNub = require('pubnub'); // ES5
// import PubNub from 'pubnub'; // ES6

five.Board().on('ready', function() {
  console.log('ready');

  // Initialize the RGB LED
  var led = new five.Led.RGB({
    pins: {
      red: 6,
      green: 5,
      blue: 3
    }
  });

  led.on();
  led.color({red: 0, blue: 0, green: 0});

  var pubnub = new PubNub({
    publishKey: 'pub-c-0b43969b-341d-41f5-a85e-0bd9d30404b8',
    subscribeKey: 'sub-c-cb24903e-c9f4-11e5-b684-02ee2ddab7fe',
    ssl: true
  });

  var channel = 'hue-clone';

  pubnub.addListener({
      message: function(message) {
        setLedColor(message);
      },
      status: function(statusEvent) {
        // subscribed (connected) to channel was successful
        if (statusEvent.category === "PNConnectedCategory") {
          console.log("connected to " + channel);
          initLedColor();
        }

        // you may want to handle each category uniquely. 
        // the other non error status will be logged to console in the "else" below
        else if (statusEvent.category === "PNNetworkIssuesCategory") {
          console.error(statusEvent);
        }
        else if (statusEvent.category === "PNNetworkDownCategory") {
          console.error(statusEvent);
        }
        else if (statusEvent.category === "PNAccessDeniedCategory") {
          console.error(statusEvent);
        }
        else if (statusEvent.category === "PNMalformedResponseCategory") {
          console.error(statusEvent);
        }
        else if (statusEvent.category === "PNBadRequestCategory") {
          console.error(statusEvent);
        }
        else if (statusEvent.category === "PNTimeoutCategory") {
          console.error(statusEvent);
        }
        // other non error status events
        else {
          console.log(statusEvent);
        }
      }
  });

  pubnub.subscribe({
    channels: [channel]
  });

  function setLedColor(m) {
    led.color({red: m.r, blue: m.b, green: m.g});
    console.log( 'color change to...' );
    console.log( led.color() );
  }

  function initLedColor() {
    pubnub.history(
      {
          channel: channel,
          count: 1
      },
      function (status, response) {
        var msgs = response.messages;
        if (msgs != undefined && msgs.length > 0) {
          // only 1 message fetched, so use element 0 to get it
          msgs[0].forEach(function(m) {
            // loop through the elements of the "brightness" message: r, g & b
            // and set the LED color
            setLedColor(m);
          });
        }
      }
    );
  }
  
}