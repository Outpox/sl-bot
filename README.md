### Songlink discord bot

#### Getting started
Copy `.env.example` to `.env` and set your discord bot token and other requirements.  
`cd docker && docker-compose up` to start Redis (cache) and the ELK stack (logs).  
Install dependencies with `npm install`  
Start the bot with `npm start` and the bot should appear after a bit on the communities he's part of.  
  
#### Containers configuration
|Tool|Port|
|----|----|
|Redis|6379|
|Elasticsearch|9200|
|Kibana|http://localhost:5601|

#### Improvements idea
* `!sla` to query albums?
* Support other languages
* Add throttling (1 query/s max per user)
* User and server/guild blacklist
* Delete the user's message
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
* ~~Command alias~~
* ~~Intro message~~
* ~~`sl_help` so that our users can contact us if need be~~
* ~~Handle errors when no song can be found to get rid of the placeholders~~
* ~~Answer a first time and then edit the message~~
* ~~Add a cache for user queries~~
* ~~Suggestions carrousel~~
