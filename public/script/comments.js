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
