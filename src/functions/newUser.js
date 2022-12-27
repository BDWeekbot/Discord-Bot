const {User} = require("../models");
async function newUser(message) {
  console.log(
    "new user start"
  )
        let user = message.author.id

        message.channel.send("New User:")
        try{
          await User.create({
            _id: user, //.id
            user: user,
            firstName: "", //.id
            lastName: "",
            birthday: "", // 
          });
      
          console.log(`user ${user} created`)
      
        }catch(err){
          console.log(err)
        };

        
        const filter = m => m.author.id === user

          message.channel.send("What is your first name?")
          message.channel
          .awaitMessages({filter: filter, max: 1, time: 60000})
          .then((collected) => { 
              
              console.log(collected.first().content)
              let fName = collected.first().content

              User.findByIdAndUpdate(user, { firstName: fName },
                function (err, docs) {
                  if (err){
                  console.log(err)
                  }
                  else{
                  console.log("Updated Message : ", docs);
                  }
                  });
          })
          .catch((error) => {
            console.log("Catch exec")
            console.log(error)
          }).then(() =>{
            message.channel.send("What is your last name?")
            message.channel
            .awaitMessages({filter: filter, max: 1, time: 60000})
            .then((collected) => { 
                
                console.log(collected.first().content)
                let lName =  collected.first().content

                User.findByIdAndUpdate(user, { lastName: lName },
                  function (err, docs) {
                    if (err){
                    console.log(err)
                    }
                    else{
                    console.log("Updated Message : ", docs);
                    }
                    });
            })
            .catch((error) => {
              console.log("Catch exec")
              console.log(error)
            }) .then(() =>{
              message.channel.send("When is your Birthday (mm/dd/yyyy)?")
              message.channel
              .awaitMessages({filter: filter, max: 1, time: 60000})
              .then((collected) => { 
                  
                  console.log(collected.first().content)
                  let birthday = collected.first().content
  
                  User.findByIdAndUpdate(user, { birthday: birthday },
                    function (err, docs) {
                      if (err){
                      console.log(err)
                      }
                      else{
                      console.log("Updated Message : ", docs);
                      }
                      });
              })
              .catch((error) => {
                console.log("Catch exec")
                console.log(error)
              }).then(() => {
                message.channel.send(`Thanks ${message.author}, your data is now being collected and sold to big business. We're watching your every move.`)
              })
            })
          })
        
      }
    
       /*
       _id: user, //.id
        user: user,
        firstName: fName, //.id
        birthday: birthday, // 
       */

        
   

module.exports = {newUser}

// github discord auth token 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