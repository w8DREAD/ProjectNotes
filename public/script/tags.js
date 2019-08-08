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
