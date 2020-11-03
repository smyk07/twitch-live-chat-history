const socket = io('http://localhost:8080');

const renderChats = (channels) => {
  channels.forEach((c) => {
    console.log(!$(c).length);
    if (!$(c).length) {
      $('#chatRooms').append(`
        <div class="chats" id="${c.replace('#', '')}">
          <a href="https://www.twitch.tv/${c.replace('#', '')}" target="_blank">
            <h3>${c}</h3>
          </a>
        </div>
      `);
      $('#channelList').append(`
      <tr id="${c.replace('#', '')}Tr">
        <td>${c}</td>
        <td>
          <svg style="cursor:pointer" id="${c.replace('#', '')}Button" data-channel="${c}" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
            <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
          </svg>
        </td>
      <tr>
      `);
      $(`${c}Button`).on('click', (e) => {
        const target = $(e.target);
        const channelToDisconnect = target.data('channel');
        $(channelToDisconnect).remove();
        $(channelToDisconnect+'Tr').remove();
        socket.emit('disconnectChannel', channelToDisconnect);
      });
    }
  });
};

const addChat = () => {
  const chatInputValue = $('#chatInput').val().toLowerCase();
  if(chatInputValue!=''){
    socket.emit('addChat', `#${chatInputValue}`);
  }
  $('#chatInput').val('');
};

const renderMessage = (message) => {
  const { channel, message: m, tags } = message;
  const { 'display-name': displayName, color, mod } = tags;

  const chatRoom = $(channel);
  if(chatRoom.length>0){
    const isScrolledToBottom = chatRoom[0].scrollHeight - chatRoom[0].clientHeight <= chatRoom[0].scrollTop + 5;
  
    chatRoom.append(`
      <p>
        <strong style="color: ${color}">${mod ? '[MOD]' : ''}${displayName}</strong>: ${m}
      </p>
    `);
  
    if (isScrolledToBottom) chatRoom.animate({ scrollTop: chatRoom[0].scrollHeight }, 1);
  }
};

socket.on('channels', (channels) => renderChats(channels));

socket.on('chat', (message) => {
  renderMessage(message);
});

let isDarkModeStr = false;

if (document.cookie) {
  isDarkModeStr = document.cookie
    .split('; ')
    .find((row) => row.startsWith('dark-mode'))
    .split('=')[1];
}

const isDarkMode = isDarkModeStr == 'true';

if (isDarkMode) {
  $('input.checkbox').prop('checked', true);
  $('.theme').attr('href', 'themes/dark.css');
  $('#channel-table').attr('class', 'table table-dark');
} else {
  $('.theme').attr('href', 'themes/styles.css');
  $('#channel-table').attr('class', 'table');
}

$('.checkbox').click(() => {
  date = new Date();
  date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
  expires = date.toUTCString();
  if ($('input.checkbox').is(':checked')) {
    $('.theme').attr('href', 'themes/dark.css');
    $('#channel-table').attr('class', 'table table-dark');
    darkMode = true;
  } else {
    $('.theme').attr('href', 'themes/styles.css');
    $('#channel-table').attr('class', 'table');
    darkMode = false;
  }
  // create a cookie that expires after 30 days
  document.cookie = `dark-mode=${darkMode};Expires=${expires};Max-age=2592000;SameSite=Strict`;
});
