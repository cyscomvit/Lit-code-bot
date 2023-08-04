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
let memberScores = {}
const SHEET_LINK = '1uP9kyrUGwV80C0Dy8NCfPlJoUcQ7zTCaAaBJgB3IqbU'
const SHEET_API = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_LINK}/values/Sheet1?alt=json&key=${process.env.SHEET_API_KEY}`
let channelId = ''
client.on("ready", () => {
    console.log('Logged in as ' + client.user.tag)
    channelId = client.channels.cache.get("1136692829410820128")
    getSolveStatus()
    
})


client.on("messageCreate", msg => {
    console.log('message received in channel')
    
})

async function getSolveStatus() {
    let memberdata = await fetch(SHEET_API)
    let memberJsonData = await memberdata.json()
    //console.log(memberJsonData)
    for (let i = 1; i < memberJsonData['values'].length; i++) {
        // console.log(memberJsonData['values'][i][0] + ' ' + memberJsonData['values'][i][1])
        let profileUrl = 'https://faisal-leetcode-api.cyclic.app/' + memberJsonData['values'][i][1]

        // Find the number of problems solved by the member
        let data = await fetch(profileUrl)
        let jsonData = await data.json()
        let score = jsonData['totalSolved']
        console.log(memberJsonData['values'][i][0] + ' solved ' + score + ' problems till now.')
    }
}

client.login(process.env.TOKEN)