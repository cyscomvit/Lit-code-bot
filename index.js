const { Client, GatewayIntentBits } = require('discord.js')

require('dotenv').config();
import('node-fetch') 
.then((res)=>{})         
.catch((err)=>{ console.log(err) });
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
	],
});

const SHEET_LINK = '1uP9kyrUGwV80C0Dy8NCfPlJoUcQ7zTCaAaBJgB3IqbU'
const SHEET_API = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_LINK}/values/Sheet1?alt=json&key=${process.env.SHEET_API_KEY}`
let channelId = ''
client.on("ready", () => {
    console.log('Logged in as ' + client.user.tag)
    channelId = client.channels.cache.get("1136692829410820128")
    let now = new Date()
    let timeLeft = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16,25,0,0) - now
    if (timeLeft < 0) {
    getSolveStatus()
    timeLeft += 86400000
}
setTimeout(getSolveStatus, timeLeft)
    
})
client.on("messageCreate", msg => {
    if (!msg.author.bot) {
        console.log('message received in channel')
        let words = msg.content.split(' ')
        //console.log(words)
        if (words[0] === "GetScore") {
            let profileUrl = 'https://faisal-leetcode-api.cyclic.app/' + words[1];

            // Find the number of problems solved by the member
            
            (async function () {
                let data = await fetch(profileUrl)
                let jsonData = await data.json()
                let score = jsonData['totalSolved']
                channelId.send(`User ${words[1]} has solved ${score} problems till now.`)
            })()
        }
    }
})

const fs = require("fs");
let scoreData = fs.readFileSync("scores.json")
let scoreObject = JSON.parse(scoreData)

function intializeJson() {
    scoreData = fs.readFileSync("scores.json")
    scoreObject = JSON.parse(scoreData)
}

function addUser(userName,fullName,score) {
    console.log(scoreObject)
    let objToAdd = {
        "name":fullName,
        "score":score
    }
    scoreObject[userName] = objToAdd
    let toWrite = JSON.stringify(scoreObject)
    fs.writeFile('scores.json', toWrite, err => {
        if (err) throw err
        return(console.log("User " + userName + " added."))
    })
}

function updateScore(username,score) {
    scoreObject[username]['score'] = score
    let toWrite = JSON.stringify(scoreObject)
    fs.writeFile('scores.json', toWrite, err => {
        if (err) throw err
        console.log(`Score updated for user ${username}`)
    })
}


console.log
async function getSolveStatus() {
    let statusUpdate = "Today's LeetCode stats: \n"
    let memberdata = await fetch(SHEET_API)
    let memberJsonData = await memberdata.json()
    //console.log(memberJsonData)
    for (let i = 1; i < memberJsonData['values'].length; i++) {
        intializeJson()
        let username = memberJsonData['values'][i][1]
        let fullName = memberJsonData['values'][i][0]
        // console.log(username)
        let profileUrl = 'https://faisal-leetcode-api.cyclic.app/' + username

        // Find the number of problems solved by the member
        let data = await fetch(profileUrl)
        let jsonData = await data.json()
        let score = jsonData['totalSolved']
        //console.log(score)
        // console.log(fullName + ' solved ' + score + ' problems till now.')
        
        // console.log(sheetScore + ' ' + score)
        if (scoreObject.hasOwnProperty(username)) {
            let sheetScore = scoreObject[username]['score']
            if (score > sheetScore) {
                if (sheetScore != 0) {
                    statusUpdate += `${fullName} solved ` + (score-sheetScore) + ` problems.\n`
                }
                updateScore(username, score)
            }
        } else {
            //console.log(typeof(score))
            if (typeof(score) == 'number') {
                setTimeout(addUser, 1000, username,fullName,score)
            }
        }
    }
    channelId.send(statusUpdate)
}



client.login(process.env.TOKEN)