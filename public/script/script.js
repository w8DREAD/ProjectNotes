
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
  });
}

// удалить заметку
window.addEventListener('click', (target) => {
  const targetClassName = target.target.parentNode.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'close button notes') {
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

// редактировать тэг
window.addEventListener('click', (target) => {
  const targetClassName = target.target.parentNode.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'like edit tag button') {
    return new Promise((resolve) => {
      const tag = document.getElementById(`tag-${idForDb}`);
      const tagText = tag.innerText;
      tag.setAttribute('contenteditable', 'true');
      tag.removeAttribute('href');
      tag.style.background = '#FFFFFF';
      tag.focus();
      resolve([tag, tagText]);
    })
      .then(([tag, tagText]) => {
        const elemNote = tag;
        elemNote.onblur = function () {
          const saveChange = window.confirm('Сохранить изменения?');
          elemNote.style.background = '';
          tag.setAttribute('contenteditable', 'false');
          tag.setAttribute('href', '');
          if (saveChange) {
            const editText = `tagText=${elemNote.innerText}`;
            xhr('put', `notes/${idForDb}`, editText);
          } else {
            elemNote.innerText = tagText;
          }
        };
      });
  }
});

// редактировать заметку
window.addEventListener('click', (target) => {
  const targetClassName = target.target.parentNode.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'like edit text button') {
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
          note.setAttribute('contenteditable', 'false');
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
    xhr('post', '/api/v1/comments/create', json, 'application/json')
      .then((res) => {
        const response = JSON.parse(res);
        containerForComments.insertAdjacentHTML('beforebegin', `<div class="articles-news comments">
               ${textInner}<br>
                <button type="submit" class="close button comment" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true" id="delete-comment-${response.id}" name=${response.id}>&times;</span>
                </button> <br>
                <span aria-hidden="true" style="float: left; margin-top: 10px">Комментарий от: ${response.author}</span>
            </div>`);
        enterField.innerText = '';
        return true;
      });
  }
});

// удалить комментарий
window.addEventListener('click', (target) => {
  const targetClassName = target.target.parentNode.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'close button comment') {
    const comment = target.path.find((container) => {
      if (container.attributes.class) {
        if (container.attributes.class.value === 'articles-news comments') {
          return container;
        }
      }
      return false;
    });
    const deleteApply = window.confirm('Вы уверены что хотите удалить комментарий?');
    if (deleteApply) {
      xhr('delete', `/api/v1/comments/${idForDb}`);
      comment.parentNode.removeChild(comment);
    }
  }
});

// поставить лайк
window.addEventListener('click', (target) => {
  const targetClassName = target.target.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'like') {
    const json = JSON.stringify({
      noteId: idForDb,
    });
    xhr('post', '/api/v1/notes/like', json, 'application/json')
      .then((res) => {
        if (JSON.parse(res).status) {
          return 1;
        }
        return -1;
      })
      .then((like) => {
        const currentLikes = document.querySelector(`span.like > p[name="${idForDb}"]`);
        currentLikes.innerText = (+currentLikes.innerText + like);
        return true;
      })
      .catch(err => err);
  }
});
