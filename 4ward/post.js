// 예시 댓글 데이터
let comments = [
  {user:"000", time:"1 min ago", text:"댓글 내용\n댓글 내용", actions:["Like", "Reply"]},
  {user:"000", time:"1 min ago", text:"😍😍\n🥰🥰", actions:["Like", "Reply"]},
];

// 댓글 렌더링
function renderComments() {
  const cmtBox = document.getElementById('comments');
  cmtBox.innerHTML = '';
  comments.forEach(cmt => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <div>
        <span class="comment-user">${cmt.user}</span>
        <span class="comment-meta">${cmt.time}</span>
      </div>
      <div class="comment-text">${cmt.text.replace(/\n/g,'<br>')}</div>
      <div class="comment-actions">
        ${cmt.actions.map(act=>`<span>${act}</span>`).join('')}
      </div>
    `;
    cmtBox.appendChild(div);
  });
}

// 댓글 등록
document.getElementById('commentForm').onsubmit = function(e){
  e.preventDefault();
  const input = document.getElementById('commentInput');
  if (input.value.trim()) {
    comments.push({user:"000", time:"now", text:input.value, actions:["Like","Reply"]});
    input.value = '';
    renderComments();
  }
};
window.onload = renderComments;
