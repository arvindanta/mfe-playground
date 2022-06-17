const log = (msg, isAppShell = false) => {
  const container = document.querySelector('#status-content');

  let color = '#7feef4';
  if (!isAppShell) color = '#7ff488';
  container.innerHTML +=
    '<br/><br/>' +
    '<span>' +
    new Date().toLocaleTimeString() +
    '</span>&nbsp;&nbsp;' +
    `<span style="color:${color}">` +
    msg +
    '</span>';
};
document.querySelector('#clear-log').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#status-content').innerHTML = '';
});

window.log = log;

window.addEventListener('message', (d) => {
  if (d.data?.log) log(d.data.log);
});

export { log };
