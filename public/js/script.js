'strict mode';
//querySelector
const header = document.querySelector('header');
const allImgs = document.querySelectorAll('img');

/*

lazy load img

*/
const lazyImg = new IntersectionObserver(function (entries, o) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      entry.target.addEventListener('load', img => {
        o.unobserve(entry.target);
        const innerObserver = new IntersectionObserver(
          entries => {
            const [inner] = entries;
            if (inner.isIntersecting) {
              inner.target.classList.remove('hide');
            }
          },
          { threshold: 0.1, root: null }
        );
        innerObserver.observe(entry.target);
      });
    }
  });
});
//prettier-ignore
allImgs && allImgs.forEach(img => {
    img.classList.add('hide');
    lazyImg.observe(img);
  });
/*para que funcione hay que decirle de donde tiene que cargar para despues
hacer que el evento load funcione. Si pongo el link en el <img> la imagen
siempre va a cargar independiente de lo que haga el evento load.

*ojo * si las imagenes cargan antes es por que antes de cargar los elementos
vacios estan intersectando con la pantalla

* ojo2 * el ratio no va a funcionar por que antes de cargar la imagen
ya esta intersectando amenos que el elemento vacio este completamente
fuera de la pantalla.*/

/*

user login

*/
let cookieInfo;
if (document.cookie) {
  cookieInfo = document.cookie.split(';').reduce((acc, curr) => {
    const [key, value] = curr.split('=');
    acc[key.trim()] = value.trim();
    return acc;
  }, {});
  header.insertAdjacentHTML(
    'beforeend',
    `<a class="header-btn-username" href="/board/user-profile/${cookieInfo.username}">${cookieInfo.username}</a>`
  );
} else {
  header.insertAdjacentHTML('beforeend', `<a class="header-btn-username" href="/signup">Entrar</a>`);
}
//prettier-ignore

/*

Barra horizontal

*/
const progressBar = document.querySelector('.progress-bar');
!parseInt(progressBar.style.left) && progressBar.classList.add('hide');

window.addEventListener('scroll', e => {
  const barWidth = parseInt(progressBar.style.left);
  barWidth || barWidth > 99 ? progressBar.classList.remove('hide') : progressBar.classList.add('hide');
  const obs = (n = 100) => Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * n);
  progressBar.style.left = `${obs()}%`;
});

// const reading = document.querySelector('.center-bar');
// reading.style.top = `${obs < 100 && calc(obs)}%`;
