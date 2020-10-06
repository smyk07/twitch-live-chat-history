const findIcon = (message, iconsArr) => {
  let newMessage = '';

  message.split(' ').forEach((word) => {
    const target = iconsArr.filter(icon => icon.name === word);
    if (
      target.length > 0
      && target[0]
      && target[0].url
    ) {
      const targetMessage = newMessage.length > 0 ? newMessage : message;

      newMessage = targetMessage.replace(word, `<span><img src=${target[0].url} alt=${target[0].name} /></span>`);
    }
  });

  return newMessage.length > 0 ? newMessage : message;
};

module.exports = {
  findIcon
};
