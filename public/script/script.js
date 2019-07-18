/* eslint-disable array-callback-return */

function xhr(method, url, dataSend) {
  const XHR = new XMLHttpRequest();
  XHR.open(method, url, true);
  XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  XHR.send(dataSend);
}


window.addEventListener('click', (target) => {
  if (target.target.parentNode.className == 'close button') {
    return new Promise((resolve) => {
      const idForDb = target.target.attributes.name.value;
      const post = target.path.find((container) => {
        if (container.attributes.class) {
          if (container.attributes.class.value == 'articles-news') {
            return container;
          }
        }
        return false;
      });
      resolve([post, idForDb]);
    })
      .then(([post, idForDb]) => {
        const deleteApply = window.confirm('Заметка удалиться со всеми комментариями!\n Вы уверены что хотите удалить заметку?');
        if (deleteApply) {
          const main = document.querySelector('div.content');
          xhr('delete', `notes/${idForDb}`);
          main.removeChild(post);
        }
      });
  }
  if (target.target.parentNode.className == 'like edit button') {
    return new Promise((resolve) => {
      const idForDb = target.target.attributes.name.value;
      const note = document.getElementById(`note-${idForDb}`);
      const noteText = note.innerText;
      note.setAttribute('contenteditable', 'true');
      note.style.background = '#FFFFFF';
      note.focus();
      resolve([note, idForDb, noteText]);
    })
      .then(([note, idForDb, noteText]) => {
        note.onblur = function () {
          const saveChange = window.confirm('Сохранить изменения?');
          note.style.backgroundImage = '-webkit-radial-gradient(center, circle farthest-corner, #fff, #e2e2e2)';
          note.setAttribute('contenteditable', 'false');
          if (saveChange) {
            noteText = note.innerText.replace();

            const xhr = new XMLHttpRequest();
            xhr.open('put', `notes/${idForDb}`, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xhr.send(`noteText=${note.innerText}`);
          } else {
            note.innerText = noteText;
          }
        };
      });
  }
  return console.log('123');
});
