const {
    Client,
    Collection,
    GatewayIntentBits,
    messageLink,
    CommandInteractionOptionResolver,
    MessageReaction,
    Partials,
    Guild,
    DefaultRestOptions,
  } = require("discord.js");

function eventModule(){


    // daily date check
    let fDate = new Date();
    let date = convertDate(fDate)
    function convertDate(date){
      let month = String(date.getMonth() + 1);
      let day = String(date.getDate());
      const year = String(date.getFullYear());

      return (`${month}/${day}/${year}`)
    }
    function checkTime(){
      let newDateF = new Date();
      let newDate = convertDate(newDateF)
        if(date === newDate){
          console.log(date, newDate)
          console.log("same Date") 
          return;
        };
        date = newDate
        let formatDate = convertDate(date)
        console.log(formatDate)
      // users for each if birthday === formatDate  send Happy Birthday
       
      }


    setInterval(() => {
      checkTime()
      
    }, 4320) //  8640,0000 = 1 Day
   
    

    
}

module.exports = {eventModule}