const log = (msg) => {
  const container = document.querySelector('#statusbar');
  container.innerHTML +=
    '<br/><br/>' +
    '<span>' +
    new Date().toLocaleTimeString() +
    '</span>&nbsp;&nbsp;' +
    "<span style='color:green'>" +
    msg +
    '</span>';
};
window.log = log;
export { log };
