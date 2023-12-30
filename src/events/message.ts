import {event, Events} from "../utils/utilsExport.js"

export default event(Events.MessageCreate, ({log}, msg) => {
    if (msg.content === "ping"){
        return msg.reply("pong")
    }
})