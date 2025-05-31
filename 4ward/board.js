// 게시글 더미 데이터
const posts = [
  { id:1, title:'[팀원 모집] Flutter 개발자 구해요!', date:'24/05/28', author:'000', view:'11' },
  { id:2, title:'[자유게시판] 전공 추천 좀 해주세요', date:'24/05/27', author:'000', view:'17' },
  { id:3, title:'제목', date:'24/05/26', author:'000', view:'21' },
  { id:4, title:'제목', date:'24/05/25', author:'000', view:'3' },
  { id:5, title:'제목', date:'24/05/24', author:'000', view:'7' },
];

const imageUpload = document.getElementById('imageUpload');
const previewImage = document.getElementById('previewImage');

imageUpload.addEventListener('change', (event) => {
const file = event.target.files[0];
if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}
});

// 게시글 렌더링
function renderBoardList() {
  const tbody = document.getElementById('boardTableBody');
  tbody.innerHTML = '';
  posts.forEach(post => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${post.title}</td>
      <td>${post.date}</td>
      <td>${post.author}</td>
      <td>${post.view}</td>
    `;
    tr.addEventListener('click', () => {
      alert('상세 페이지로 이동 (추후 연결)');
    });
    tbody.appendChild(tr);
  });
}



// 모달 show/hide
document.getElementById('writeBtn').onclick = () => {
  document.getElementById('modalOverlay').classList.add('show');
};
document.getElementById('modalClose').onclick = () => {
  document.getElementById('modalOverlay').classList.remove('show');
};
document.getElementById('postForm').onsubmit = (e) => {
  e.preventDefault();
  alert('글이 작성되었습니다! (추후 게시글 추가)');
  document.getElementById('modalOverlay').classList.remove('show');
};

window.onload = renderBoardList;
