# Poor Man's HUE Smart Light Bulb Demo
## with Arduino, Common Cathode RGB LED, Johnny-Five, and PubNub

The tutorial is available on [Tuts+](http://code.tutsplus.com/tutorials/how-to-create-a-smart-device-with-arduino-and-nodejs-using-pubnub--cms-25508).

The Tuts+ tutorial was written with v1 code, so some code snippets in the tutorial do not match in the latest code in this repo. See the changes below.

### Changes in v2

- Instead of sending each color value like `{color:red, brightness: 123}`, now all color values is sent as one object at a time, as `{r: 123, g: 98, b: 0}`
- Added `subscribe()` in the front-end code to reset the UI slider position every time other subscribers make changes
- Added `history()` in the front-end code to initialize the UI slider's initial state by reading the very last values from history
- Added `history()` in the node.js code to initialize the LED color state at the initial load