'strict mode';

const formBtnSignup = document.querySelector('.form-btn-signup');

const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

formBtnSignup.addEventListener('click', e => {
  e.preventDefault();

  const [username, email, password] = [...document.querySelector('.form')];

  const data = JSON.stringify({ username: username.value, email: email.value, password: password.value });

  fetch('http://localhost:3333/signup', {
    method: 'POST',
    headers: headers,
    credentials: 'include',
    body: data,
  })
    .then(data => data.redirected && (document.location.href = '/board'))
    .catch(err => console.error('Error:', err));
});
