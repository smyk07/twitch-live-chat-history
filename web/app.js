const socket = io("http://localhost:8080");

const renderChats = channels => {
  channels.forEach(c => {
    $('body').append(`
      <div class="chats" id="${c.replace('#', '')}">
        <h3>${c}</h3>
      </div>
    `)
  })
}

const renderMessage = (message) => {
  const {channel, message: m, tags} = message;
  const {'display-name': displayName, color, mod} = tags;

  const chatRoom = $(channel);
  const isScrolledToBottom = chatRoom[0].scrollHeight - chatRoom[0].clientHeight <= chatRoom[0].scrollTop + 1;

  chatRoom.append(`
    <p>
      <strong style="color: ${color}">${mod ? '[MOD]' : ''}${displayName}</strong>: ${m}
    </p>
  `);

  if(isScrolledToBottom)
    chatRoom.animate({"scrollTop": chatRoom[0].scrollHeight}, 1);
};

socket.on('channels', channels => renderChats(channels));

socket.on('chat', message => {
  renderMessage(message);
})