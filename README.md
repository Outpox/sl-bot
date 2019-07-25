### Songlink discord bot

#### Getting started
Copy `.env.example` to `.env` and set your discord bot token.  
Install dependencies with `npm install`  
Start the bot with `npm start` and the bot should appear after a bit on the communities he's part of.  


#### Improvements idea
* Delete the user's message
* Answer a first time and then edit the message
* Suggestions carrousel
* Add a cache for user queries
* Use a db for per guild configurations
* Configurations:
  * Override the default locale
  * Restrict the bot to a single channel
  * Restrict bot access to groups or users

Finished
* ~~Analytics?~~
* ~~Add some damn real logs (winston)~~
* ~~Add a listening mode: parse spotify & co links automatically~~
* ~~Use a limited set of platforms in an effort to ease the songlink api load~~
