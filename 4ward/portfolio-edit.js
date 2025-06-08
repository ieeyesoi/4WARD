const portfolioForm = document.getElementById('portfolioForm');
const previewImage = document.getElementById('previewImage');
const imageUpload = document.getElementById('imageUpload');

let originalPortfolio = null;

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("잘못된 접근입니다.");
    window.location.href = "portfolio.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/portfolios/${id}`);
    if (!res.ok) throw new Error("불러오기 실패");

    const data = await res.json();
    originalPortfolio = data;

    document.getElementById("portfolioTitle").value = data.title || "";
    document.getElementById("portfolioAuthor").value = data.author || "";
    document.getElementById("portfolioLanguage").value = data.language || "";
    document.getElementById("portfolioDate").value = data.date || "";
    document.getElementById("portfolioGithub").value = data.github || "";
    document.getElementById("portfolioTags").value = data.tags || "";
    document.getElementById("portfolioDescription").value = data.description || "";

    // ✅ category: 배열로 받아서 체크
    if (Array.isArray(data.category)) {
      data.category.forEach(cat => {
        const checkbox = document.querySelector(`input[name="portfolioCategory"][value="${cat}"]`);
        if (checkbox) checkbox.checked = true;
      });
    } else if (typeof data.category === "string") {
      // 이전 방식 대비
      const checkbox = document.querySelector(`input[name="portfolioCategory"][value="${data.category}"]`);
      if (checkbox) checkbox.checked = true;
    }

    if (data.imageUrl) {
      previewImage.src = data.imageUrl;
    }

  } catch (err) {
    console.error(err);
    alert("포트폴리오를 불러오는 중 오류가 발생했습니다.");
  }
};

// 이미지 미리보기
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

portfolioForm.onsubmit = async (e) => {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const studentId = localStorage.getItem("studentId");

  // ✅ 카테고리 여러 개 체크
  const categoryCheckboxes = document.querySelectorAll('input[name="portfolioCategory"]:checked');
  if (categoryCheckboxes.length === 0) {
    alert("카테고리를 하나 이상 선택해주세요!");
    return;
  }

  const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);

  const title = document.getElementById("portfolioTitle").value;
  const author = document.getElementById("portfolioAuthor").value;
  const language = document.getElementById("portfolioLanguage").value;
  const date = document.getElementById("portfolioDate").value;
  const github = document.getElementById("portfolioGithub").value;
  const tags = document.getElementById("portfolioTags").value.trim();
  const description = document.getElementById("portfolioDescription").value;

  const imageUrl =
    previewImage.src.startsWith("data:image") || previewImage.src.startsWith("http")
      ? previewImage.src
      : originalPortfolio.imageUrl;

  const updatedPortfolio = {
    studentId,
    category: selectedCategories,
    title,
    author,
    language,
    date,
    github,
    tags,
    description,
    imageUrl
  };

  try {
    const res = await fetch(`http://localhost:8080/api/portfolios/${id}?studentId=${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPortfolio)
    });

    if (res.ok) {
      alert("수정 완료!");
      window.location.href = "portfolio.html";
    } else {
      const error = await res.text();
      alert("수정 실패: " + error);
    }
  } catch (err) {
    console.error(err);
    alert("서버 통신 오류");
  }
};
