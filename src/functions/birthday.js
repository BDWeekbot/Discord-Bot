const { User } = require("../models");

function Birthday(date) {
    //console.log( typeof(date.month)) type string
     console.log("month " + date.month, "day " + date.day)
     User.find({ "birthday.month": date.month, "birthday.day": date.day}, 
       function (err, birthdays) {
         console.log(birthdays)
       if (birthdays.length > 0) {
         birthdays.forEach((user) => {
           console.log(user.birthday.month, user.birthday.day)
           console.log(`Happy Birthday @${user.user}`);
         });
       } else {
         console.log("else" + err);
         return;
       }
     });
   }

   module.exports = {Birthday}