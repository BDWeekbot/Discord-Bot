function pingDerek(message) {
  let randomNumber = Math.floor(Math.random() * 20);

  if (randomNumber % 5 === 0) {
    message.channel.send(
      `Wow! ${message.content} sounds like a cool cat doesnt it <@108420414635540480>!`, // message.content is always >start-week
    );
  }
}

module.exports = { pingDerek };
