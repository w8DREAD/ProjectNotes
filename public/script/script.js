if (window.location.pathname === '/logs') {
  const socket = io.connect('http://localhost:3000');
  socket.on('send', (data) => {
    const main = document.querySelector('div.content');
    main.insertAdjacentHTML('afterbegin', `<p style="margin: 5px 0 0 65px">${data}</p>`);
  });
}

function xhr(method, url, dataSend, value) {
  return new Promise((resolve, reject) => {
    const XHR = new XMLHttpRequest();
    XHR.open(method, url, true);
    XHR.setRequestHeader('Content-type', value || 'application/x-www-form-urlencoded');
    XHR.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(XHR.response);
      } else {
        reject({
          status: this.status,
          statusText: XHR.response,
        });
      }
    };
    XHR.onerror = function () {
      reject({
        status: this.status,
        statusText: XHR.response,
      });
    };
    XHR.send(dataSend);
  });
}
