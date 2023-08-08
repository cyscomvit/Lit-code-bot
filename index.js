const { time } = require('console');
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

const SHEET_LINK = '15fwKvLzmdCGnTCtAjlcNm66Xau4_47UMq780Ez4TjUU'
const SHEET_API = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_LINK}/values/Form%20Responses%201?alt=json&key=${process.env.SHEET_API_KEY}`
let channelId = ''
client.on("ready", () => {
    console.log('Logged in as ' + client.user.tag)
    getSolveStatus('init')
    channelId = client.channels.cache.get("1115984522522132532")
    
    let now = new Date()
    let timeLeft = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,55,0,0) - now
    console.log(timeLeft)
    if (timeLeft < 0) {
        timeLeft += 86400000
    }
    setTimeout(getSolveStatus, timeLeft)
    setInterval(getSolveStatus,86400000)
}

    
)
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

function updateScore(names) {
    for (let i = 0; i < names.length; i++) {
        scoreObject[names[i][0]]['score'] = names[i][1]
        let toWrite = JSON.stringify(scoreObject)
        fs.writeFile('scores.json', toWrite, err => {
            if (err) throw err
            console.log(`Score updated for user ${names[i][0]}`)
        })
    }
    
}


console.log
async function getSolveStatus(time) {
    console.log("Executing function")
    let namesToUpdate = []
    let statusUpdate = ""
    let memberdata = await fetch(SHEET_API)
    let memberJsonData = await memberdata.json()
    //console.log(memberJsonData)
    for (let i = 1; i < memberJsonData['values'].length; i++) {
        intializeJson()
        let username = memberJsonData['values'][i][2]
        let fullName = memberJsonData['values'][i][1]
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
                    namesToUpdate.push([username,score])
                }
                
            }
        } else {
            //console.log(typeof(score))
            if (typeof(score) == 'number') {
                setTimeout(addUser, 1000, username,fullName,score)
            }
        }
    }
    if (time === "init") {
        
    } else if (statusUpdate === "") {
        channelId.send("No one solved a problem today :(")
    } else {
        channelId.send("Today's LeetCode stats: \n" + statusUpdate)
        updateScore(namesToUpdate)
    }
}



client.login(process.env.TOKEN)