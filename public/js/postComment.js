'strict mode';

const threadCommentSection = document.querySelector('.thread-comment-section');
const postCount = document.querySelector('.thread-info-comments-qty');

const headers = new Headers();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

async function fetchPOST(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: headers,
    credentials: 'include',
    body: JSON.stringify(data),
  });
}

async function fetchNewPosts() {
  const threadCommentSectionPosts = document.querySelectorAll('.thread-comment-section > *');
  return fetchPOST('http://localhost:3333/board/check-new-posts', {
    count: threadCommentSectionPosts.length,
    fromThread: document.location.pathname.split('/').at(-1),
    fromRoute: document.location.pathname,
  });
}
try {
  const [txtArea, txtInput] = [...document.querySelector('.form-thread-reply')];
  const btnPostComment = document.querySelector('.form-btn-post-comment');

  btnPostComment.addEventListener('click', e => {
    e.preventDefault();
    const commentHTML = `<div class="thread-comment-container">
  <p class="thread-comment-content">${txtArea.value.trimStart().trimEnd()}</p>
  <a href="/board/user-profile/${cookieInfo.username}" class="thread-comment-username">${cookieInfo.username}</a>
  <time class='thread-comment-timestamp' datetime="${new Date(Date.now()).toISOString()}">Ahora</time>
  </div>`;

    //post comment

    (txtArea.value.trimStart() &&
      fetchPOST('http://localhost:3333/board/new-comment', {
        commentContent: txtArea.value.trimStart().trimEnd(),
        commentLink: txtInput.value,
        locale: navigator.language,
      })
        .then(data => {
          txtArea.value = ''.trimStart().trimEnd();
          txtArea.focus();
          data.ok && threadCommentSection.insertAdjacentHTML('beforeend', commentHTML);
          initUsernameModal();
          //check new posts
          return fetchNewPosts();
        })
        .then(res => res.json())
        .then(newPostsResponse => {
          newPostsResponse.newPosts && document.location.reload();
        })
        .catch(err => console.error('Error:', err))) ||
      txtArea.focus();
  });
} catch {
  console.log('Ups, closed thread comment section.');
}
