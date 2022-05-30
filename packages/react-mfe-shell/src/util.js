const log = (msg) => {
  const container = document.querySelector('#status-content');
  container.innerHTML +=
    '<br/><br/>' +
    '<span>' +
    new Date().toLocaleTimeString() +
    '</span>&nbsp;&nbsp;' +
    "<span style='color:#7ff488'>" +
    msg +
    '</span>';
};
document.querySelector('#clear-log').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#status-content').innerHTML = '';
});

window.log = log;
export { log };
