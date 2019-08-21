// добавить заметку
if (document.querySelector('button.register-user')) {
  const addNotes = document.querySelector('button.register-user');

  addNotes.addEventListener('click', async () => {
    const username = document.getElementById('validationDefaultUsername');
    const password = document.getElementById('validationDefault01');
    const email = document.getElementById('validationDefault02');
    const telephone = document.getElementById('validationDefault03');
    const dateBirthday = document.getElementById('validationDefault04');
    const json = JSON.stringify({
      username: username.value,
      password: password.value,
      email: email.value,
      telephone: +telephone.value,
      dateBirthday: dateBirthday.value,
    });
    xhr('post', '/api/v1/users/', json, 'application/json')
      .then(() => {
        window.location.href = './login';
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
