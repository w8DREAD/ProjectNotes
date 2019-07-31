// добавить заметку
if (document.querySelector('button.register-user')) {
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
