# LeetCode Discord Bot
A discord bot to track the number of problems solved by the users on LeetCode

The bot fetches the list of users from Google Sheet. The Sheet must be shared with public access. The sheet to be used can be set by changing the value of ```SHEET_LINK``` variable. API key is required to use the API link.

The bot routinely checks for changes in the ```totalCount``` property in the API fetch from LeetCode everyday at 11:55 PM, and prints a list of users that have solved more problems in the 24-hour period. The time and interval can be changed by changing the parameters for the ```Date()``` function under the ```client.on()``` function for the 'ready' event.

The scores of the users are stored in the scores.json file. The file is initially empty, and gets populated the first time the bot is run, and scores get updated everyday at 11:55 PM.

The channel to which the message is sent can be set by replacing the channel ID in ```channelId = client.channels.cache.get("<channel-id>")``` (the id should be in quotes).
The channel id can be obtained be turning on the developer options in Discord and selecting 'Copy Channel ID' from the channel options.