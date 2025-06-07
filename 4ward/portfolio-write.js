const imageUpload = document.getElementById('imageUpload');
const previewImage = document.getElementById('previewImage');
const portfolioForm = document.getElementById('portfolioForm');

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

  const studentId = localStorage.getItem("studentId");
  const title = document.getElementById('portfolioTitle').value;
  const author = document.getElementById('portfolioAuthor').value;
  const language = document.getElementById('portfolioLanguage').value;
  const date = document.getElementById('portfolioDate').value;
  const github = document.getElementById('portfolioGithub').value;
  const tags = document.getElementById('portfolioTags').value.trim();
  const description = document.getElementById('portfolioDescription').value;

  const categoryCheckboxes = document.querySelectorAll('input[name="portfolioCategory"]:checked');
  if (categoryCheckboxes.length === 0) {
    alert('카테고리를 하나 이상 선택해주세요!');
    return;
  }
  const categories = Array.from(categoryCheckboxes).map(cb => cb.value);

  const imageUrl = previewImage.src.startsWith('data:image') ? previewImage.src : '';

  const portfolioData = {
    studentId,
    category: categories,
    title,
    author,
    imageUrl,
    language,
    date,
    github,
    tags,
    description
  };

  try {
    const res = await fetch('http://localhost:8080/api/portfolios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(portfolioData)
    });

    if (res.ok) {
      alert('포트폴리오가 등록되었습니다!');
      window.location.href = 'portfolio.html';
    } else {
      const err = await res.text();
      alert('등록 실패: ' + err);
    }
  } catch (err) {
    console.error(err);
    alert('서버 통신 오류');
  }
};
