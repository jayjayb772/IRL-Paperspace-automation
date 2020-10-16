const request = require('request')
async function paperspaceDiscordMessage(title, messageTxt, desc, color="#00ff00", data=null){
    let embed =  {
        "title": `${title}`,
        "description": `${desc}`,
        "color": `${color}`
    }
    let message = JSON.stringify({
        "content": `${messageTxt}`,
        "embeds": embed
    })
    let options = {
        "headers": {
            "content-type": "application/json"
        },
        "body": message
    }

    request.post(`${process.env.discordWebhook}`, options, (err, res) => {
        //console.log(res)
        return res
    })
}

module.exports = {paperspaceDiscordMessage}