window.onload = async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("잘못된 접근입니다.");
    window.location.href = "portfolio.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/portfolios/${id}`);
    if (!res.ok) throw new Error("포트폴리오 정보를 불러올 수 없습니다.");
    const data = await res.json();
    renderDetail(data);
    await loadComments(id);
  } catch (err) {
    console.error(err);
    alert("서버 오류로 포트폴리오 정보를 불러오지 못했습니다.");
  }
};

function renderDetail(portfolio) {
  document.getElementById("detailTitle").textContent = portfolio.title || '제목 없음';
  document.getElementById("detailMainImage").src = 'sw-icon.png';
  document.getElementById("detailMainImage").alt = portfolio.title || '이미지';

  document.getElementById("detailCategory").textContent = Array.isArray(portfolio.category)
    ? portfolio.category.join(", ")
    : portfolio.category || "없음";
  document.getElementById("detailAuthor").textContent = portfolio.author || "익명";
  document.getElementById("detailDate").textContent = portfolio.date || "알 수 없음";
  document.getElementById("detailLanguage").textContent = portfolio.language || "없음";
  document.getElementById("detailGithub").innerHTML = portfolio.github
    ? `<a href="https://${portfolio.github}" target="_blank">${portfolio.github}</a>`
    : "없음";
  document.getElementById("detailTags").textContent = portfolio.tags || "없음";
  document.getElementById("detailDescription").innerHTML =
    portfolio.description?.replace(/\n/g, "<br>") || "설명이 없습니다.";

  const loggedInStudentId = localStorage.getItem("studentId");
  if (loggedInStudentId && loggedInStudentId === portfolio.studentId) {
    const ownerBox = document.getElementById("ownerButtons");
    ownerBox.style.display = "flex";

    document.getElementById("editBtn").onclick = () => {
      window.location.href = `portfolio-edit.html?id=${portfolio.id}`;
    };

    document.getElementById("deleteBtn").onclick = async () => {
      const confirmDelete = confirm("정말 삭제하시겠습니까?");
      if (!confirmDelete) return;

      try {
        const res = await fetch(`http://localhost:8080/api/portfolios/${portfolio.id}?studentId=${loggedInStudentId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("삭제되었습니다.");
          window.location.href = "portfolio.html";
        } else {
          alert("삭제 실패: " + (await res.text()));
        }
      } catch (err) {
        alert("서버 오류로 삭제에 실패했습니다.");
        console.error(err);
      }
    };
  }

  // 댓글 등록 이벤트
  document.getElementById("submitCommentBtn").onclick = async () => {
    const commentInput = document.getElementById("commentInput");
    const anonymousCheckbox = document.getElementById("anonymousCheckbox");
    const text = commentInput.value.trim();
    const studentId = localStorage.getItem("studentId");
    const anonymous = anonymousCheckbox.checked;

    if (!text || !studentId) return;

    try {
      const res = await fetch(`http://localhost:8080/api/portfolios/${portfolio.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, text, anonymous }),
      });

      if (res.ok) {
        commentInput.value = '';
        anonymousCheckbox.checked = false;
        await loadComments(portfolio.id);
      } else {
        alert("댓글 등록 실패");
      }
    } catch (err) {
      console.error("댓글 등록 오류:", err);
    }
  };
}

async function loadComments(postId) {
  try {
    const res = await fetch(`http://localhost:8080/api/portfolios/${postId}/comments`);
    if (!res.ok) throw new Error("댓글 API 호출 실패");
    const comments = await res.json();
    if (!Array.isArray(comments)) throw new Error("댓글 형식 오류");

    renderComments(comments);
  } catch (err) {
    console.error("댓글 불러오기 실패:", err);
  }
}

function renderComments(comments) {
  const list = document.getElementById("detailCommentsList");
  const count = document.getElementById("detailCommentCount");
  const studentId = localStorage.getItem("studentId");

  count.textContent = `${comments.length}개의 댓글`;
  list.innerHTML = '';

  comments.forEach(comment => {
    const item = document.createElement("div");
    item.className = "comment-item";
    item.dataset.commentId = comment.id;
    item.dataset.postId = comment.postId;

    const isOwner = studentId === comment.studentId;

    item.innerHTML = `
      <div class="comment-author">${comment.authorName || '익명'}</div>
      <div class="comment-meta">${comment.createdAt?.substring(0, 10)}</div>
      <div class="comment-content">${comment.text.replace(/\n/g, "<br>")}</div>
      ${isOwner ? `
        <div class="comment-actions">
          <button class="comment-edit-btn">수정</button>
          <button class="comment-save-btn" style="display:none;">저장</button>
          <button class="comment-delete-btn">삭제</button>
        </div>
      ` : ""}
    `;

    list.appendChild(item);
  });
}

// 댓글 수정 및 삭제 이벤트 위임
document.getElementById("detailCommentsList").addEventListener("click", async (e) => {
  const target = e.target;
  const item = target.closest(".comment-item");
  const commentId = item?.dataset.commentId;
  const postId = item?.dataset.postId;
  const studentId = localStorage.getItem("studentId");

  if (!commentId || !postId) return;

  // ✅ 수정 버튼
  if (target.classList.contains("comment-edit-btn")) {
    const contentDiv = item.querySelector(".comment-content");
    const originalText = contentDiv.innerText;
    contentDiv.innerHTML = `<textarea class="edit-textarea" style="width:100%;">${originalText}</textarea>`;

    item.querySelector(".comment-edit-btn").style.display = "none";
    item.querySelector(".comment-save-btn").style.display = "inline-block";
  }

  // ✅ 저장 버튼
  if (target.classList.contains("comment-save-btn")) {
    const newText = item.querySelector(".edit-textarea").value.trim();
    if (!newText) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/portfolios/${postId}/comments/${commentId}?studentId=${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newText),
      });

      if (res.ok) {
        await loadComments(postId);
      } else {
        alert("수정 실패");
      }
    } catch (err) {
      console.error("댓글 수정 오류:", err);
    }
  }

  // ✅ 삭제 버튼
  if (target.classList.contains("comment-delete-btn")) {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:8080/api/portfolios/${postId}/comments/${commentId}?studentId=${studentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadComments(postId);
      } else {
        alert("삭제 실패");
      }
    } catch (err) {
      console.error("댓글 삭제 오류:", err);
    }
  }
});
