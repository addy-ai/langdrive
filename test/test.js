const { GoogleDriveChatBot } = require("langdrive");

const bot = new GoogleDriveChatBot({
    GOOGLE_CLIENT_ID: "CLIENT_ID",
    GOOGLE_CLIENT_SECRET: "CLIENT_SECRET"
})

bot.sendMessage("Where did I go to college?")

