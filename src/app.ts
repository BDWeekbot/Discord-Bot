import {client} from "./client.js"
import { Commandler } from "./handlers/commandler.js";
import { ActivityType } from "discord.js";
import mongoose from "mongoose";
import { WeekListener } from "./handlers/weekListener.js";


client.on("ready", function () {
    console.log("Connected as " + client.user?.tag);
    client.user?.setActivity("Derek", { type: ActivityType.Watching });
    Commandler(client); // message + reaction handler
    WeekListener(client);
   
    // a pollactivecheck
    // instantiate events on application load
    // pollModule() -- not built - instantiate message listeners
  });


  // mongoose connect
let mongooseconnectionstring: string | undefined = process.env.DB_Url;

if (mongooseconnectionstring) {
  mongoose
    .connect(mongooseconnectionstring, { dbName: "discordServer" })
    .then(() => console.log("Connected to MongoDB"));
}