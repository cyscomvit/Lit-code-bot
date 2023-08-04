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
let channelId = ''
client.on("ready", () => {
    console.log('Logged in as ' + client.user.tag)
    channelId = client.channels.cache.get("1136692829410820128")
    updateScores()
    
})


let memberDetails = [
    {
        name:'Karthik Chandrasekhar',
        siteId:'Karthik2025',
        count:0   
    },
    {
        name:'Aditya Sai',
        siteId:'AdityaSai2004',
        count:0   
    }
]
client.on("messageCreate", msg => {
    console.log('message received in channel')
})

async function getSolveStatus(userid) {
    console.log(userid['name'])
    let profileUrl = 'https://faisal-leetcode-api.cyclic.app/' + userid['siteId']
    let data = await fetch(profileUrl)
    let jsonData = await data.json()
    let score = jsonData['totalSolved']
    console.log(score + ' ' + userid['count'] + typeof(score))
    if (score > userid['count']) {
        //console.log(channelId)
        let diff = score-userid['count']
        let display = userid['name'] + " solved " + diff + " more problems!"
        channelId.send(display)
        userid['count'] = score
        return 1
    }
    return 0
}

async function updateScores() {
    for (let i = 0; i < memberDetails.length; i++) {
        await getSolveStatus(memberDetails[i])
    }
    console.log(memberDetails)
    
}


client.login(process.env.TOKEN)