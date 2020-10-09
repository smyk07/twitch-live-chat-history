const socket = io('http://localhost:8080')

const renderChats = (channels) => {
  channels.forEach((c) => {
    console.log(!$(c).length)
    if (!$(c).length) {
      $('#chatRooms').append(`
        <div class="chats" id="${c.replace('#', '')}">
          <h3>${c}</h3>
        </div>
      `)
      $('#channelNav').append(`
        <button class="btn btn-link" id="${c.replace(
          '#',
          '',
        )}Button" data-channel="${c}">${c}</button>
      `)
      $(`${c}Button`).on('click', (e) => {
        const target = $(e.target)
        const channelToDisconnect = target.data('channel')
        console.log(channelToDisconnect)
        $(channelToDisconnect).remove()
        target.remove()
        socket.emit('disconnectChannel', channelToDisconnect)
      })
    }
  })
}

const addChat = () => {
  const chatInputValue = $('#chatInput').val().toLowerCase()
  socket.emit('addChat', `#${chatInputValue}`)
  $('#chatInput').val('')
}

const renderMessage = (message) => {
  const { channel, message: m, tags } = message
  const { 'display-name': displayName, color, mod } = tags

  const chatRoom = $(channel)
  const isScrolledToBottom =
    chatRoom[0].scrollHeight - chatRoom[0].clientHeight <=
    chatRoom[0].scrollTop + 5

  chatRoom.append(`
    <p>
      <strong style="color: ${color}">${
    mod ? '[MOD]' : ''
  }${displayName}</strong>: ${m}
    </p>
  `)

  if (isScrolledToBottom)
    chatRoom.animate({ scrollTop: chatRoom[0].scrollHeight }, 1)
}

socket.on('channels', (channels) => renderChats(channels))

socket.on('chat', (message) => {
  renderMessage(message)
})

$('.checkbox').click(() => {
  if ($('input.checkbox').is(':checked')) {
    $('.theme').attr('href', 'themes/dark.css')
  } else {
    $('.theme').attr('href', 'themes/styles.css')
  }
})
