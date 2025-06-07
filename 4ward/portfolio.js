const itemsPerPage = 6;
let currentPage = 1;
let portfoliosData = []; // 포트폴리오 전체 리스트 저장용

const portfolioGrid = document.getElementById('portfolioGrid');

function getFilteredPortfolios() {
  const checkedCategories = [...document.querySelectorAll('.filter-category input[type="checkbox"]')]
    .filter(cb => cb.checked)
    .map(cb => cb.value.trim());

  return portfoliosData.filter(p => {
    if (!p.category) return false;

    // 정규화: 문자열이면 배열로 만들고 공백 제거
    let categories = [];
    if (Array.isArray(p.category)) {
      categories = p.category.map(c => c.trim());
    } else if (typeof p.category === "string") {
      categories = p.category.split(',').map(c => c.trim());
    }

    return categories.some(cat => checkedCategories.includes(cat));
  });
}

// 포트폴리오 카드 렌더링
function renderPortfolioCards(data, page = 1) {
  currentPage = page;
  portfolioGrid.innerHTML = '';

  const filtered = getFilteredPortfolios();
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = filtered.slice(start, end);

  currentItems.forEach(portfolio => {
    const card = document.createElement('div');
    card.classList.add('portfolio-card');
    const imageContent = portfolio.imageUrl
      ? `<img src="${portfolio.imageUrl}" alt="${portfolio.title}">`
      : '🖼️';
    card.innerHTML = `
      <div class="portfolio-card__image">${imageContent}</div>
      <div class="portfolio-card__info">
        <div class="portfolio-card__category">${portfolio.category}</div>
        <div class="portfolio-card__title">${portfolio.title}</div>
        <div class="portfolio-card__author">제작자: ${portfolio.author}</div>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `portfolio-detail.html?id=${portfolio.id}`;
    });
    portfolioGrid.appendChild(card);
  });

  renderPagination(filtered.length, page);
}

// 페이지네이션 렌더링
function renderPagination(totalItems, currentPage) {
  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 5;
  const half = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - half);
  let endPage = Math.min(totalPages, currentPage + half);

  if (currentPage <= half) endPage = Math.min(totalPages, maxVisiblePages);
  else if (currentPage + half > totalPages) startPage = Math.max(1, totalPages - maxVisiblePages + 1);

  if (startPage > 1) {
    const firstBtn = document.createElement('button');
    firstBtn.textContent = '1';
    firstBtn.onclick = () => renderPortfolioCards(portfoliosData, 1);
    paginationContainer.appendChild(firstBtn);

    if (startPage > 2) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      paginationContainer.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => renderPortfolioCards(portfoliosData, i);
    paginationContainer.appendChild(btn);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      paginationContainer.appendChild(dots);
    }
    const lastBtn = document.createElement('button');
    lastBtn.textContent = totalPages;
    lastBtn.onclick = () => renderPortfolioCards(portfoliosData, totalPages);
    paginationContainer.appendChild(lastBtn);
  }
}

// 서버에서 포트폴리오 불러오기
async function getPortfolios() {
  try {
    const res = await fetch("http://localhost:8080/api/portfolios");
    if (!res.ok) throw new Error("서버 응답 실패");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("포트폴리오 불러오기 실패:", err);
    return [];
  }
}

// 초기 렌더링
window.onload = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/portfolios");
    if (!res.ok) throw new Error("서버 응답 실패");
    const data = await res.json();
    portfoliosData = data;
    renderPortfolioCards(portfoliosData, 1);
  } catch (err) {
    console.error("포트폴리오 불러오기 실패:", err);
  }

  const writeBtn = document.getElementById("writeBtn");
  if (writeBtn) {
    writeBtn.onclick = () => {
      window.location.href = "portfolio-write.html";
    };
  }

  const categoryCheckboxes = document.querySelectorAll('.filter-category input[type="checkbox"]');
  categoryCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => renderPortfolioCards(portfoliosData, 1));
  });
};
