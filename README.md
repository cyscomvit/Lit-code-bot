# LeetCode Discord Bot
A discord bot to track the number of problems solved by the users on LeetCode

The ```memberDetails``` array stores objects which store the name, LeetCode username, and total number of problems solved. The bot sends a message to the channel whenever the count of problems returned by the API fetch is greater than the one in the object.

The channel to which the message is sent can be set by replacing the channel ID in ```channelId = client.channels.cache.get("<channel-id>")``` (the id should be in quotes).
The channel id can be obtained be turning on the developer options in Discord and selecting 'Copy Channel ID' from the channel options.