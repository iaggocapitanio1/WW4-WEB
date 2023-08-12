const scrollToBottom = (id) => {
  const element = document.getElementById(id);

  if (element) element.scrollTop = element?.scrollHeight;
};

export default scrollToBottom;
