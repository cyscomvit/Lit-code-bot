let scoreData = fs.readFileSync("scores.json")
if (typeof(JSON.parse(scoreData)) ==='object') {
    scoreObject = []
    scoreObject.push(JSON.parse(scoreData))
} else {
    scoreObject = JSON.parse(scoreData)
}