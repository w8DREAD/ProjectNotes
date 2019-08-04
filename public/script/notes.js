// добавить заметку
if (document.querySelector('button.add-notes')) {
  const addNotes = document.querySelector('button.add-notes');

  addNotes.addEventListener('click', async () => {
    const tag = document.getElementById('inputTags');
    const note = document.querySelector('textarea.form-control');
    const json = JSON.stringify({
      tagText: tag.value,
      noteText: note.value,
    });
    xhr('post', '/api/v1/addNotes', json, 'application/json')
      .then(() => {
        window.location.href = 'notes';
      })
      .catch((err) => {
        const elemErr = `<div class="alert alert-warning" role="alert" id="elemErr">
          ${err.statusText}
      </div>`;
        const form = addNotes.parentNode;
        if (document.getElementById('elemErr')) {
          form.firstChild.parentNode.removeChild(form.firstChild);
        }
        return form.insertAdjacentHTML('afterbegin', elemErr);
      });
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
            xhr('put', `notes/${idForDb}`, editText)
              .catch(() => {
                elemNote.innerText = tagText;
              });
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
          elemNote.style.background = '';
          note.setAttribute('contenteditable', 'false');
          if (saveChange) {
            const editText = `noteText=${elemNote.innerText}`;
            xhr('put', `notes/${idForDb}`, editText)
              .catch(() => {
                elemNote.innerText = noteText;
              });
          } else {
            elemNote.innerText = noteText;
          }
        };
      });
  }
});
// поставить лайк
window.addEventListener('click', (target) => {
  const targetClassName = target.target.className;
  let idForDb;
  let response;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'like') {
    const json = JSON.stringify({
      noteId: idForDb,
    });
    xhr('post', '/api/v1/notes/like', json, 'application/json')
      .then((res) => {
        response = res;
        if (JSON.parse(res).status) {
          return 1;
        }
        return -1;
      })
      .then((like) => {
        const currentLikes = document.querySelector(`span.like > p[name="${idForDb}"]`);
        currentLikes.innerText = (+currentLikes.innerText + like);
        const likes = document.querySelector('h6');
        likes.innerText = `Набрано лайков: ${JSON.parse(response).likesCount}`;
        return true;
      })
      .catch(err => err);
  }
});
