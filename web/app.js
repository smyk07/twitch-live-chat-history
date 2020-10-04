const socket = io("http://localhost:8080");

const renderChats = channels => {
  channels.forEach(c => {
    $('body').append(`
      <div class="chats">
        <h3>${c}</h3>
        <div id="${c.replace('#', '')}">
        </div>
      </div>
    `)
  })
}

const renderMessage = (message) => {
  const {channel, message: m, tags} = message;
  const {'display-name': displayName, color, mod} = tags;

  $(channel).append(`
        <p>
            <strong style="color: ${color}">${mod && '[MOD]'}${displayName}</strong>: ${m}
        </p>
  `);
  $(channel).animate({"scrollTop": $(channel)[0].scrollHeight}, "fast");
};

socket.on('channels', channels => renderChats(channels));

socket.on('chat', message => {
  console.log(message);
  renderMessage(message);
})