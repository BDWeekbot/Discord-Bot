function pingDerek(message) {
    let randomNumber = Math.floor(Math.random() * 20);
  
    if (randomNumber % 5 === 0) {
      message.channel.send(
        `Wowzers! ${message.content} sounds like a wonderful week name doesnt it <@108420414635540480>!` // message.content is always >start-week
  
      );
    }
  }

  module.exports = {pingDerek}