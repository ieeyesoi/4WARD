// 이미지 미리보기
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

let allPosts = []; // 전체 게시글 저장
let currentPage = 1;
const postsPerPage = 10;


function getFilteredPosts() {
  const checkedFilters = [...document.querySelectorAll('.filter-category input[type="checkbox"]')]
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  return allPosts.filter(post => {
    if (!post.category) return false;
    const postCategories = post.category.split(',');
    return postCategories.some(cat => checkedFilters.includes(cat));
  });
}


// 게시글 렌더링
function renderBoardList(page = 1) {
  currentPage = page;
  const tbody = document.getElementById('boardTableBody');
  tbody.innerHTML = '';

  const filteredPosts = getFilteredPosts(); // ← 필터링된 글들
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = filteredPosts.slice(start, end);

  pagePosts.forEach(post => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${post.title}</td>
      <td>${post.createdAt?.substring(0, 10) || '날짜 없음'}</td>
      <td>${
        post.studentId === "anonymous"
          ? "익명"
          : post.authorName || post.studentId || "익명"
      }</td>


      <td>${post.views}</td>
    `;
    tr.addEventListener('click', () => {
      window.location.href = `post.html?id=${post.id}`;
    });
    tbody.appendChild(tr);
  });

  renderPagination(filteredPosts.length);
}


// 페이지네이션 렌더링
function renderPagination(filteredLength = allPosts.length) {
  const paginationDiv = document.querySelector('.pagination');
  paginationDiv.innerHTML = '';

  const totalPages = Math.ceil(filteredLength / postsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => renderBoardList(i);
    paginationDiv.appendChild(btn);
  }
}


// 글 작성
document.getElementById('postForm').onsubmit = async (e) => {
  e.preventDefault();

  const title = document.getElementById('postTitle').value;
  const content = document.getElementById('postContent').value;
  const categoryCheckboxes = document.querySelectorAll('.category-checkboxes input[type="checkbox"]');

    // ✅ 카테고리 유효성 검사
  const selectedCategories = [...categoryCheckboxes]
    .filter(cb => cb.checked)
    .map(cb => cb.parentElement.innerText.trim());

  if (selectedCategories.length === 0) {
    alert("카테고리를 최소 1개 이상 선택해주세요!");
    return; // 작성 중단
  }

  const anonymous = document.getElementById("anonymousCheck").checked;
  const studentId = anonymous ? "anonymous" : localStorage.getItem("studentId");

  const category = selectedCategories.join(',');

  const newPost = {
    title,
    content,
    studentId,
    category
  };

  try {
    const res = await fetch("http://localhost:8080/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    });

    if (res.ok) {
      alert("글이 작성되었습니다!");
      document.getElementById('modalOverlay').classList.remove('show');
      await loadPostsFromServer(); // 글 작성 후 목록 새로고침
    } else {
      alert("작성 실패");
    }
  } catch (err) {
    console.error("작성 오류", err);
  }
};

// 모달 show/hide
document.getElementById('writeBtn').onclick = () => {
  // 작성 폼 초기화
  document.getElementById('postTitle').value = '';
  document.getElementById('postContent').value = '';

  // 체크박스도 전부 체크 해제
  const checkboxes = document.querySelectorAll('.category-checkboxes input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);

  // 모달 열기
  document.getElementById('modalOverlay').classList.add('show');
};

document.getElementById('modalClose').onclick = () => {
  document.getElementById('modalOverlay').classList.remove('show');
};

// 서버에서 게시글 불러오기
async function loadPostsFromServer() {
  try {
    const res = await fetch("http://localhost:8080/api/posts");
    const posts = await res.json();

    console.log("📦 서버에서 받아온 posts:", posts); // ✅ 디버깅용 로그

    if (!Array.isArray(posts) || posts.length === 0) {
      console.warn("❗ 게시글이 없거나 형식이 잘못됨");
    }

    allPosts = posts.reverse(); // 최신순 정렬
    renderBoardList(1);
  } catch (err) {
    console.error("게시글 불러오기 실패", err);
  }
  const categoryFilters = document.querySelectorAll('.filter-category input[type="checkbox"]');
  categoryFilters.forEach(cb => cb.addEventListener('change', () => renderBoardList(1)));

}


// 페이지 로드시 게시글 불러오기
window.onload = loadPostsFromServer;
