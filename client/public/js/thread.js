'strict mode';
//prettier-ignore
const textarea = document.querySelector('textarea');
const allComments = document.querySelectorAll('.thread-comment-container');

function initUsernameModal() {
  const usernameModal = document.querySelector('.thread-author-username-modal');
  const allPopups = document.querySelectorAll(`[class*='username']`);
  function followPointer(e) {
    const posY = e.clientY + 20;
    const posX = e.clientX + 8;
    const rightBorder = posX + usernameModal.clientWidth;

    usernameModal.style.top = `${posY}px`;
    usernameModal.style.left = `${
      rightBorder < window.innerWidth ? posX : window.innerWidth - usernameModal.clientWidth
    }px`;
  }

  allPopups.forEach(comment => {
    comment.addEventListener('mouseenter', _ => {
      document.addEventListener('mousemove', followPointer);
      usernameModal.classList.add('show');
    });
  });

  allPopups.forEach(comment => {
    comment.addEventListener('mouseleave', _ => {
      usernameModal.classList.remove('show');
    });
  });
}
initUsernameModal();
//textarea focus
// textarea &&
//   window.outerHeight >= document.documentElement.scrollHeight &&
//   textarea.focus();

//textarea auto height(revisar por que salta)
textarea &&
  textarea.addEventListener('keydown', e => {
    e.currentTarget.style.cssText = `height:auto`;
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
    e.currentTarget.scrollTop = e.currentTarget.scrollHeight;
  });

//textarea es el target y root es el elemento con el cual queremos que intersecte el target
//root: null: viewport completo
//threshold/ratio: el porcentaje de intersection para llamar a la funcion(10% = 0.1)
//la funcion recibe 2 argumentos, entries y aveces es util pasarle el objeto de opciones de nuevo
const textareaObserver = new IntersectionObserver(
  function (entries) {
    entries[0].isIntersecting && textarea.focus();
  },
  {
    root: null,
    threshold: 1, //1=primer pixel en intersectar, 0= ultimo pixel en intersectar
    rootMargin: '100px', // 100 px antes que intersecte
  }
);
textarea && textareaObserver.observe(textarea);

const commentObserver = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.isIntersecting && entry.target.classList.remove('hide');
      observer.unobserve(entry.target);
    });
  },
  {
    root: null,
    threshold: 0.5,
    rootMargin: '30px',
  }
);
//
//              *************
//
// const commentObs = document.querySelector('.reading');
// const commentTrackObserver = new IntersectionObserver(
//   function (entries) {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) console.log('yes');
//     });
//   },
//   {
//     root: commentObs,
//     threshold: 1,
//   }
// );
allComments &&
  allComments.forEach(comment => {
    comment.classList.add('hide');
    commentObserver.observe(comment);
    // commentTrackObserver.observe(comment);
  });

// [id^='someId'] ID empieza con.

// [id$='someId'] ID termina con.

// [id*='someId'] Id contiene el string.
