let comments = [];
let currentPostId = null;

async function loadComments() {
  try {
    const res = await fetch(`http://localhost:8080/api/posts/${currentPostId}/comments`);
    if (!res.ok) throw new Error("댓글 불러오기 실패");

    comments = await res.json();
    renderComments();
  } catch (err) {
    console.error("댓글 불러오기 실패", err);
  }
}

function renderComments() {
  const cmtBox = document.getElementById('comments');
  cmtBox.innerHTML = '';

  const loggedInStudentId = localStorage.getItem("studentId");

  comments.forEach(cmt => {
    const div = document.createElement('div');
    div.className = 'comment';

    const isOwner = loggedInStudentId && cmt.studentId === loggedInStudentId;

    const actionButtons = isOwner
      ? `
        <button class="comment-edit-btn" data-id="${cmt.id}">수정</button>
        <button class="comment-save-btn" data-id="${cmt.id}" style="display:none;">저장</button>
        <button class="comment-delete-btn" data-id="${cmt.id}">삭제</button>
      `
      : '';

    div.innerHTML = `
      <div>
        <span class="comment-user">
          ${cmt.authorName || (cmt.anonymous ? "익명" : cmt.studentId)}
        </span>
        <span class="comment-meta">${cmt.createdAt ? cmt.createdAt.replace('T', ' ').substring(0, 16) : ''}</span>
      </div>
      <div class="comment-text">${cmt.text.replace(/\n/g, '<br>')}</div>
      <div class="comment-actions">
        ${actionButtons}
      </div>
    `;

    cmtBox.appendChild(div);
  });

  const countSpan = document.getElementById("commentCount");
  if (countSpan) {
    countSpan.textContent = `${comments.length}개의 댓글`;
  }
}

document.getElementById("comments").addEventListener("click", async (e) => {
  const target = e.target;

  if (target.classList.contains("comment-delete-btn")) {
    const commentId = target.dataset.id;
    const confirmed = confirm("정말 이 댓글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const studentId = localStorage.getItem("studentId");

      const res = await fetch(`http://localhost:8080/api/posts/${currentPostId}/comments/${commentId}?studentId=${studentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제 실패");

      comments = comments.filter(c => c.id != commentId);
      renderComments();
    } catch (err) {
      alert("댓글 삭제 중 오류 발생");
      console.error(err);
    }
  }

  if (target.classList.contains("comment-edit-btn")) {
    const commentDiv = target.closest(".comment");
    const textDiv = commentDiv.querySelector(".comment-text");
    const originalText = textDiv.innerText;
    const saveBtn = commentDiv.querySelector(".comment-save-btn");

    textDiv.innerHTML = `<textarea class="edit-textarea" style="width:100%;">${originalText}</textarea>`;

    target.style.display = "none";
    saveBtn.style.display = "inline-block";
  }

  if (target.classList.contains("comment-save-btn")) {
    const commentDiv = target.closest(".comment");
    const textarea = commentDiv.querySelector(".edit-textarea");
    const newText = textarea.value.trim();
    const commentId = target.dataset.id;
    const studentId = localStorage.getItem("studentId");

    if (!newText) {
      alert("내용을 입력하세요!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/posts/${currentPostId}/comments/${commentId}?studentId=${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newText)
      });

      if (!res.ok) throw new Error("수정 실패");

      await loadComments();
    } catch (err) {
      alert("댓글 수정 중 오류 발생");
      console.error(err);
    }
  }
});

async function loadPostDetail() {
  try {
    await fetch(`http://localhost:8080/api/posts/${currentPostId}/views`, {
      method: "PUT",
    });
  } catch (err) {
    console.error("조회수 증가 실패", err);
  }

  try {
    const res = await fetch(`http://localhost:8080/api/posts/${currentPostId}`);
    if (!res.ok) throw new Error("불러오기 실패");

    const post = await res.json();

    document.querySelector(".post-title").innerText = `[${post.category}] ${post.title}`;
    document.querySelector(".post-body").innerText = post.content;
    document.querySelector(".author-name").innerText = post.authorName || post.studentId || "익명";
    document.querySelector(".created-time").innerText = post.createdAt
      ? post.createdAt.replace("T", " ").substring(0, 16)
      : "날짜 없음";
    document.getElementById("viewCount").textContent = `조회수: ${post.views}`;

    document.getElementById("editTitle").value = post.title;
    document.getElementById("editContent").value = post.content;

    const checkboxes = document.querySelectorAll('.category-checkboxes input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.checked = post.category?.includes(cb.value);
    });

    const loggedInStudentId = localStorage.getItem("studentId");
    const postAuthorId = post.studentId;

    if (loggedInStudentId !== postAuthorId) {
      const editBtn = document.getElementById("editBtn");
      const deleteBtn = document.getElementById("deleteBtn");
      if (editBtn) editBtn.style.display = "none";
      if (deleteBtn) deleteBtn.style.display = "none";
    }

  } catch (err) {
    console.error("게시글 상세 불러오기 실패", err);
    document.querySelector(".post-title").innerText = "게시글을 불러올 수 없습니다.";
  }
}

// ✅ 진짜 중요한 부분: 페이지 로드 후 실행
window.onload = () => {
  const postId = new URLSearchParams(window.location.search).get("id");

  if (!postId) {
    alert("잘못된 접근입니다 (postId 없음)");
    return;
  }

  currentPostId = postId;

  loadPostDetail();
  loadComments();

  const editBtn = document.getElementById("editBtn");
  const modal = document.getElementById("editModalOverlay");
  const closeBtn = document.getElementById("editModalClose");

  if (editBtn && modal && closeBtn) {
    editBtn.onclick = () => modal.classList.add("show");
    closeBtn.onclick = () => modal.classList.remove("show");
  }

  const commentForm = document.getElementById('commentForm');
  const commentInput = document.getElementById('commentInput');
  if (commentForm && commentInput) {
    commentForm.onsubmit = async function(e) {
      e.preventDefault();
      const text = commentInput.value.trim();
      const isAnonymous = document.getElementById("anonymousCommentCheck").checked;
      const studentId = localStorage.getItem("studentId");

      if (!text) return;

      try {
        const res = await fetch(`http://localhost:8080/api/posts/${currentPostId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text,
            studentId: studentId,
            anonymous: isAnonymous
          })
        });

        if (!res.ok) throw new Error("댓글 등록 실패");

        commentInput.value = "";
        document.getElementById("anonymousCommentCheck").checked = false;
        loadComments();
      } catch (err) {
        alert("댓글 등록 실패");
        console.error(err);
      }
    };
  }

  const editForm = document.getElementById("editForm");
  if (editForm) {
    editForm.onsubmit = async (e) => {
      e.preventDefault();

      const newTitle = document.getElementById("editTitle").value;
      const newContent = document.getElementById("editContent").value;

      const checkedCategories = [...document.querySelectorAll('.category-checkboxes input:checked')]
        .map(cb => cb.value);

      if (checkedCategories.length === 0) {
        alert("카테고리를 최소 1개 이상 선택해주세요!");
        return;
      }

      const newCategory = checkedCategories.join(',');
      const loggedInStudentId = localStorage.getItem("studentId");

      try {
        const res = await fetch(`http://localhost:8080/api/posts/${currentPostId}?studentId=${loggedInStudentId}`, {
          method: "PUT",
          headers: { "Content-Type": "text/plain" },
          body: newContent.trim(),
        });

        if (res.ok) {
          alert("수정 완료!");
          location.reload();
        } else {
          alert("수정 실패");
        }
      } catch (err) {
        console.error("수정 요청 실패", err);
      }
    };
  }

  const deleteBtn = document.getElementById("deleteBtn");
  if (deleteBtn) {
    deleteBtn.onclick = async () => {
      const confirmDelete = confirm("정말 이 글을 삭제하시겠습니까?");
      if (!confirmDelete) return;

      try {
        const loggedInStudentId = localStorage.getItem("studentId");
        const res = await fetch(`http://localhost:8080/api/posts/${currentPostId}?studentId=${loggedInStudentId}`, {
          method: "DELETE"
        });

        if (res.ok) {
          alert("삭제 완료!");
          window.location.href = "board.html";
        } else {
          alert("삭제 실패");
        }
      } catch (err) {
        console.error("삭제 요청 실패", err);
      }
    };
  }
};