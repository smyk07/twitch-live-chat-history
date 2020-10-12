const findIcon = (message, iconsArr) => {
  let newMessage = message;

  const uniqueMessages = message.split(' ').filter((value, index, self) => self.indexOf(value) === index);
  uniqueMessages.forEach((word) => {
    const target = iconsArr.find((icon) => icon.name === word);
    if (target && target.url && target.name) {
      const regex = new RegExp(word, 'gi');
      newMessage = newMessage.replace(regex, `<span><img src="${target.url}" alt="${target.name}" /></span>`);
    }
  });

  return newMessage;
};

module.exports = {
  findIcon,
};
