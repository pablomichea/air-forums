'strict mode';

const threadCommentSection = document.querySelector('.thread-comment-section');
const postCount = document.querySelector('.thread-info-comments-qty');
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

function fetchPOST(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: headers,
    credentials: 'include',
    body: JSON.stringify(data),
  });
}

function fetchNewPosts() {
  const threadCommentSectionPosts = document.querySelectorAll('.thread-comment-section > *');
  return fetchPOST('https://war-z.onrender.com/board/check-new-posts', {
    count: threadCommentSectionPosts.length,
    fromThread: document.location.pathname.split('/').at(-1),
    fromRoute: document.location.pathname,
  });
}
try {
  const [txtArea, txtInput] = [...document.querySelector('.form-thread-reply')];
  const btnPostComment = document.querySelector('.form-btn-post-comment');
  console.log('queryselector pass');
  btnPostComment.addEventListener('click', e => {
    e.preventDefault();
    const commentHTML = `<div class="thread-comment-container">
  <p class="thread-comment-content">${txtArea.value.trimStart().trimEnd()}</p>
  <a href="/board/user-profile/${cookieInfo.username}" class="thread-comment-username">${cookieInfo.username}</a>
  <time class='thread-comment-timestamp' datetime="${new Date(Date.now()).toISOString()}">Ahora</time>
  </div>`;

    //post comment
    console.log('fetch comment...');
    (txtArea.value.trimStart() &&
      fetchPOST('https://war-z.onrender.com/board/new-comment', {
        commentContent: txtArea.value.trimStart().trimEnd(),
        commentLink: txtInput.value,
        locale: navigator.language,
      })
        .then(data => {
          console.log('then...');
          txtArea.value = ''.trimStart().trimEnd();
          txtArea.focus();
          data.ok && threadCommentSection.insertAdjacentHTML('beforeend', commentHTML);
          initUsernameModal();
          //check new posts
          return fetchNewPosts();
        })
        .then(res => res.json())
        .then(newPostsResponse => {
          console.log('check new posts responses...');
          newPostsResponse.newPosts && document.location.reload();
        })
        .catch(err => console.error('Error:', err))) ||
      txtArea.focus();
  });
} catch {
  console.log('Ups, closed thread comment section.');
}
