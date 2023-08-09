FROM node:latest


RUN apt-get update && apt-get install -y tzdata
ENV TZ=Asia/Calcutta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create the bot's directory

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot



COPY package.json /usr/src/bot

RUN npm install



COPY . /usr/src/bot



# Start the bot.

CMD ["node", "index.js"]