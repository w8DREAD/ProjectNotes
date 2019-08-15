// добавить тэг
window.addEventListener('click', (target) => {
  const targetClassName = target.target.parentNode.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }
  if (targetClassName === 'close button add tags') {
    const createInput = `<input contenteditable="true" style="float: left; margin-left: 10px; background: white" id="input-${idForDb}">`;
    const containerForInput = document.getElementById(`button-add-tags-${idForDb}`);
    const notExists = document.getElementById(`input-${idForDb}`);
    if (!notExists) {
      containerForInput.insertAdjacentHTML('afterend', createInput);
    }
    const input = document.getElementById(`input-${idForDb}`);
    input.onblur = function () {
      const tag = input.value;
      const containerForTags = document.getElementById(`container-tags-${idForDb}`);
      if (input.value.length) {
        xhr('post', '/api/v1/tags', JSON.stringify({tag: input.value, noteId: idForDb}), 'application/json')
          .then((res) => {
            input.parentNode.removeChild(input);
            containerForTags.insertAdjacentHTML('afterbegin',
              `<button type="submit" class="close button tags" data-dismiss="alert" 
                               aria-label="Close" style="float: none" id="delete-tag-{{id}}">
                 <span aria-hidden="true" id="delete-tags-${idForDb}" name=${idForDb}>&times;</span>
              </button><a id="tag-{{id}}" href="" style="margin-left: 3px">${tag}</a>`);
            return true;
          });
      } else {
        input.parentNode.removeChild(input);
      }
    };
  }
});
// удалить тэг
window.addEventListener('click', (target) => {
  const targetClassName = target.target.parentNode.className;
  let idForDb;
  if (target.target.attributes.name) {
    idForDb = target.target.attributes.name.value;
  }

  if (targetClassName === 'close button delete tags') {
    const deleteButton = document.getElementById(`delete-tag-${idForDb}`);
    const tag = document.getElementById(`tag-${idForDb}`);
    const noteId = `noteId=${target.target.parentNode.attributes.name.value}`;
    xhr('delete', `/api/v1/tags/${idForDb}`, noteId)
      .then(() => {
        tag.parentNode.removeChild(tag);
        deleteButton.parentNode.removeChild(deleteButton);
      });
  }
});
