function xhr(method, url, dataSend, value) {
  const XHR = new XMLHttpRequest();
  XHR.open(method, url, true);
  XHR.setRequestHeader('Content-type', value || 'application/x-www-form-urlencoded');

  XHR.send(dataSend);
}


window.addEventListener('click', (target) => {
  const author = 'Vasiliy';
  const targetClassName = target.target.parentNode.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'close button') {
    return new Promise((resolve) => {
      const post = target.path.find((container) => {
        if (container.attributes.class) {
          if (container.attributes.class.value === 'articles-news') {
            return container;
          }
        }
        return false;
      });
      resolve(post);
    })
      .then((post) => {
        const deleteApply = window.confirm('Заметка удалиться со всеми комментариями!\n Вы уверены что хотите удалить заметку?');
        if (deleteApply) {
          const main = document.querySelector('div.content');
          xhr('delete', `notes/${idForDb}`);
          main.removeChild(post);
        }
      });
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
  if (targetClassName === 'input-group-prepend') {
    const enterField = document.getElementById(`inputComment-${idForDb}`);
    const textInner = enterField.innerText;
    const containerForComments = document.getElementById(`add-notes-${idForDb}`);
    const json = JSON.stringify({
      id: idForDb,
      text: textInner,
    });
    xhr('post', 'notes', json, 'application/json');
    containerForComments.insertAdjacentHTML('beforebegin', `<div class="articles-news comments">
               ${textInner}<br>
                <span aria-hidden="true" style="float: right">${author}</span>
            </div>`);
    enterField.innerText = '';
  }
  return 'Ok';
});
