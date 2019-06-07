### Songlink discord bot

#### Getting started
Copy `.env.example` to `.env` and set your discord bot token.  
Install dependencies with `npm install`  
Start the bot with `npm start` and the bot should appear after a bit on the communities
he's part of.  


#### Improvements idea
* Delete the user's message
* Add some damn real logs (winston)
* Answer a first time and then edit the message
* Add a listening mode: parse spotify & co links automatically
* Use a limited set of platforms in an effort to ease the songlink api load
* Add a cache for user queries
* Use a db for per guild configurations
* Analytics?
* Configurations:
  * Override the default locale
  * Restrict the bot to a single channel
  * Restrict bot access to groups or users

#### Songlink API improvements idea (some suggestions and some stuff we need to figure out)
* Add artist and song/album title at the root of the response
* Should stop using unique ids as object's keys (entitiesByUniqueId) and instead use constant as in linksByPlatform
* When using the platform parameter, does it accepts an array of platforms?
  * Figured out that no, and that's when I understood how it worked
* What's the response if the web request fails (wrong parameters)?
* What's happening when no track can be found?
* Http response code?
