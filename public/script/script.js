
const socket = io.connect('http://localhost:3000');
socket.on('send', (data) => {
  if(window.location.pathname == '/logs') {
    const main = document.querySelector('div.content');
    main.insertAdjacentHTML('afterbegin', `<p style="margin: 5px 0 0 65px">${data}</p>`);
  }
});


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
          statusText: XHR.statusText,
        });
      }
    };
    XHR.onerror = function () {
      reject({
        status: this.status,
        statusText: XHR.statusText,
      });
    };
    XHR.send(dataSend);
  })
    .then((res) => {
      if (JSON.parse(res).status) {
        return 1;
      }
      return -1;
    })
    .catch(err => console.log(err));
}

// удалить заметку
window.addEventListener('click', (target) => {
  const targetClassName = target.target.parentNode.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'close button') {
    const post = target.path.find((container) => {
      if (container.attributes.class) {
        if (container.attributes.class.value === 'articles-news') {
          return container;
        }
      }
      return false;
    });
    const deleteApply = window.confirm('Заметка удалиться со всеми комментариями!\n Вы уверены что хотите удалить заметку?');
    if (deleteApply) {
      const main = document.querySelector('div.content');
      xhr('delete', `notes/${idForDb}`);
      main.removeChild(post);
    }
  }
});

// редактировать заметку
window.addEventListener('click', (target) => {
  const targetClassName = target.target.parentNode.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'like edit button') {
    return new Promise((resolve) => {
      const note = document.getElementById(`note-${idForDb}`);
      const noteText = note.innerText;
      note.setAttribute('contenteditable', 'true');
      note.style.background = '#FFFFFF';
      note.focus();
      resolve([note, noteText]);
    })
      .then(([note, noteText]) => {
        const elemNote = note;
        elemNote.onblur = function () {
          const saveChange = window.confirm('Сохранить изменения?');
          elemNote.style.backgroundImage = '-webkit-radial-gradient(center, circle farthest-corner, #fff, #e2e2e2)';
          elemNote.setAttribute('contenteditable', 'false');
          if (saveChange) {
            const editText = `noteText=${elemNote.innerText}`;
            xhr('put', `notes/${idForDb}`, editText);
          } else {
            elemNote.innerText = noteText;
          }
        };
      });
  }
});

// добавить комментарий
window.addEventListener('click', (target) => {
  const author = 'Vasiliy';
  const targetClassName = target.target.parentNode.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'input-group-prepend') {
    const enterField = document.getElementById(`inputComment-${idForDb}`);
    const textInner = enterField.innerText;
    const containerForComments = document.getElementById(`add-notes-${idForDb}`);
    const json = JSON.stringify({
      id: idForDb,
      text: textInner,
    });
    xhr('post', '/api/v1/notes', json, 'application/json');
    containerForComments.insertAdjacentHTML('beforebegin', `<div class="articles-news comments">
               ${textInner}<br>
                <span aria-hidden="true" style="float: right">${author}</span>
            </div>`);
    enterField.innerText = '';
  }
});

// поставить лайк
window.addEventListener('click', (target) => {
  const targetClassName = target.target.className;
  const author = 'Vasiliy';
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'like') {
    const json = JSON.stringify({
      noteId: idForDb,
      author,
    });
    xhr('post', '/api/v1/notes/like', json, 'application/json')
      .then((like) => {
        const currentLikes = document.querySelector(`span.like > p[name="${idForDb}"]`);
        currentLikes.innerText = (+currentLikes.innerText + like);
        return true;
      })
      .catch(err => err);
  }
});
