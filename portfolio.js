// 포트폴리오 더미 데이터 (이미지에서 보이는 내용 기반)
const portfolios = [
    {
        id: 1,
        category: '웹',
        title: '원도우 컨셉 포트폴리오',
        author: '김다민(23학번)',
        imageUrl: 'https://placehold.co/350x180?text=원도우 컨셉 포트폴리오', // Placeholder image
        language: 'HTML / CSS / JavaScript',
        date: '2025-05-01',
        github: 'github.com/kimdamin',
        tags: ['#웹사이트', '#html', '#포트폴리오'],
        description: 'Concept: 레트로와 나에 대하여, About me\n본문 내용... 더보기\n이 포트폴리오는 Windows 95/98 스타일의 레트로 컨셉으로 제작된 개인 웹사이트입니다. 오래된 운영체제의 UI/UX를 현대적인 웹 기술로 재해석하여 독특하고 재미있는 사용자 경험을 제공하고자 했습니다. HTML, CSS, JavaScript를 사용하여 인터페이스를 구현하고, 픽셀 아트 스타일의 아이콘과 글꼴을 적용하여 레트로 분위기를 극대화했습니다. 특히, 드래그 가능한 창, 최소화/최대화 버튼, 시작 메뉴 등의 기능을 구현하여 실제 운영체제를 사용하는 듯한 느낌을 줍니다. 개인 정보를 소개하고, 기술 스택을 나열하며, 프로젝트 경험을 시각적으로 보여주는 데 중점을 두었습니다.',
        comments: [
            { author: '000', time: '1 min ago', content: '좋은 아이디어네요!' }
        ]
    },
    {
        id: 2,
        category: '앱',
        title: '음악 추천 웹사이트',
        author: '조재영(23학번)',
        imageUrl: 'https://placehold.co/350x180?text=음악 추천 웹사이트',
        language: 'React / Node.js',
        date: '2025-05-10',
        github: 'github.com/jojayoung',
        tags: ['#음악', '#추천', '#웹앱'],
        description: '사용자의 취향에 맞는 음악을 추천해주는 웹사이트입니다. React로 프론트엔드를, Node.js로 백엔드를 구현했습니다. 데이터베이스는 MongoDB를 사용합니다.'
    },
    {
        id: 3,
        category: '게임',
        title: '어바웃 미 포트폴리오',
        author: '이예솔(23학번)',
        imageUrl: 'https://placehold.co/350x180?text=어바웃 미 포트폴리오',
        language: 'Unity / C#',
        date: '2025-04-20',
        github: 'github.com/iyeaseul',
        tags: ['#게임개발', '#개인프로젝트'],
        description: 'Unity를 활용하여 제작한 인터랙티브한 자기소개 포트폴리오입니다. 게임처럼 즐기면서 저에 대한 정보를 얻을 수 있도록 구성했습니다.'
    },
    {
        id: 4,
        category: '웹',
        title: '쇼핑몰 샘플 웹사이트',
        author: '허채민(23학번)',
        imageUrl: 'https://placehold.co/350x180?text=쇼핑몰 샘플 웹사이트',
        language: 'HTML / CSS / JavaScript',
        date: '2025-05-15',
        github: 'github.com/heojeamin',
        tags: ['#쇼핑몰', '#웹사이트', '#프론트엔드'],
        description: '반응형 디자인이 적용된 샘플 쇼핑몰 웹사이트입니다. 상품 목록, 상세 페이지, 장바구니 기능을 구현했습니다.'
    },
    {
        id: 5,
        category: '개인',
        title: '나의 첫 포트폴리오',
        author: '배수연(24학번)',
        imageUrl: 'https://placehold.co/350x180?text=나의 첫 포트폴리오',
        language: 'HTML / CSS',
        date: '2025-03-01',
        github: '',
        tags: ['#입문', '#개인', '#자기소개'],
        description: 'HTML과 CSS만을 사용하여 만든 저의 첫 개인 포트폴리오입니다. 기본적인 웹 페이지 구성에 중점을 두었습니다.'
    },
    {
        id: 6,
        category: '팀프로젝트',
        title: '스마트팜 관리 시스템',
        author: '팀 A (23학번)',
        imageUrl: 'https://placehold.co/350x180?text=스마트팜 관리 시스템',
        language: 'Python / Django',
        date: '2024-12-20',
        github: 'github.com/teama/smartfarm',
        tags: ['#스마트팜', '#IoT', '#웹백엔드', '#팀프로젝트'],
        description: '스마트팜 환경을 모니터링하고 제어하는 웹 기반 시스템입니다. 센서 데이터를 수집하고 시각화하여 농장 관리를 효율적으로 돕습니다.'
    },
    {
        id: 7,
        category: '앱',
        title: '오늘의 할일 앱',
        author: '정새연(23학번)',
        imageUrl: 'https://placehold.co/350x180?text=오늘의 할일 앱',
        language: 'Kotlin',
        date: '2025-01-10',
        github: 'github.com/parksujin/todoapp',
        tags: ['#안드로이드', '#모바일', '#투두리스트'],
        description: '안드로이드 스튜디오와 Kotlin을 사용하여 개발한 간단한 투두리스트 앱입니다. 할일 추가, 삭제, 완료 기능을 제공합니다.'
    },
    {
        id: 8,
        category: '게임',
        title: '2D 플랫포머 게임',
        author: '정윤(23학번)',
        imageUrl: 'https://placehold.co/350x180?text=2D 플랫포머 게임',
        language: 'Unreal Engine / C++',
        date: '2024-11-05',
        github: 'github.com/choijiwon/platformer',
        tags: ['#게임', '#언리얼', '#2D'],
        description: '언리얼 엔진 4를 이용하여 개발한 2D 플랫포머 게임입니다. 기본적인 이동, 점프, 아이템 획득 기능을 구현했습니다.'
    },
    {
        id: 9,
        category: '웹',
        title: '커뮤니티 웹사이트 리뉴얼',
        author: '이한별(23학번)',
        imageUrl: 'https://placehold.co/350x180?text=커뮤니티 웹사이트 리뉴얼',
        language: 'Vue.js / Firebase',
        date: '2025-02-28',
        github: 'github.com/kimminjun/community',
        tags: ['#커뮤니티', '#Vuejs', '#리뉴얼'],
        description: '기존 커뮤니티 웹사이트를 Vue.js와 Firebase를 활용하여 전면 리뉴얼했습니다. 실시간 채팅 기능과 게시글 CRUD 기능을 개선했습니다.'
    }
];

const portfolioGrid = document.getElementById('portfolioGrid');
const imageUpload = document.getElementById('imageUpload');
const previewImage = document.getElementById('previewImage');
const writeBtn = document.getElementById('writeBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const portfolioForm = document.getElementById('portfolioForm');

// 상세 페이지 모달 관련 요소
const detailModalOverlay = document.getElementById('detailModalOverlay');
const detailModalClose = document.getElementById('detailModalClose');
const detailMainImage = document.getElementById('detailMainImage');
const detailMainImageContainer = document.getElementById('detailMainImageContainer');
const detailThumbnailsContainer = document.getElementById('detailThumbnailsContainer');
const detailAuthor = document.getElementById('detailAuthor');
const detailPostTime = document.getElementById('detailPostTime');
const detailLanguage = document.getElementById('detailLanguage');
const detailDate = document.getElementById('detailDate');
const detailGithub = document.getElementById('detailGithub');
const detailTags = document.getElementById('detailTags');
const detailDescription = document.getElementById('detailDescription');
const detailCommentCount = document.getElementById('detailCommentCount');
const detailCommentsList = document.getElementById('detailCommentsList');
const commentInput = document.getElementById('commentInput');
const submitCommentBtn = document.getElementById('submitCommentBtn');


// 이미지 업로드 미리보기 기능
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

// 포트폴리오 카드 렌더링 함수
function renderPortfolioCards(data) {
    portfolioGrid.innerHTML = ''; // 기존 카드 모두 비우기
    data.forEach(portfolio => {
        const card = document.createElement('div');
        card.classList.add('portfolio-card');

        // 이미지 없을 경우 기본 아이콘 표시
        const imageContent = portfolio.imageUrl
            ? `<img src="${portfolio.imageUrl}" alt="${portfolio.title}">`
            : '🖼️';

        card.innerHTML = `
            <div class="portfolio-card__image">
                ${imageContent}
            </div>
            <div class="portfolio-card__info">
                <div class="portfolio-card__category">${portfolio.category}</div>
                <div class="portfolio-card__title">${portfolio.title}</div>
                <div class="portfolio-card__author">제작자: ${portfolio.author}</div>
            </div>
        `;
        card.addEventListener('click', () => showPortfolioDetail(portfolio)); // 카드 클릭 시 상세 모달 표시
        portfolioGrid.appendChild(card);
    });
}

// 포트폴리오 상세 모달 표시 함수
function showPortfolioDetail(portfolio) {
    // 상세 정보 채우기
    detailMainImage.src = portfolio.imageUrl || 'https://placehold.co/600x280?text=이미지'; // 메인 이미지
    detailMainImage.alt = portfolio.title;

    // 썸네일 (여기서는 메인 이미지 하나만 사용하거나, 더미 데이터에 썸네일 배열을 추가해야 함)
    // 현재는 메인 이미지 하나만 보여주므로, 썸네일 컨테이너는 비워둡니다.
    detailThumbnailsContainer.innerHTML = '';
    // 만약 썸네일이 여러 개라면 여기에 추가 로직 구현
    // 예:
    // portfolio.thumbnails.forEach(thumbUrl => {
    //   const thumbItem = document.createElement('div');
    //   thumbItem.classList.add('detail-thumbnail-item');
    //   thumbItem.innerHTML = `<img src="${thumbUrl}">`;
    //   detailThumbnailsContainer.appendChild(thumbItem);
    // });
    if (portfolio.imageUrl) { // 메인 이미지가 있으면 썸네일도 하나 추가
        const thumbItem = document.createElement('div');
        thumbItem.classList.add('detail-thumbnail-item', 'active'); // 첫 번째 썸네일은 활성화
        thumbItem.innerHTML = `<img src="${portfolio.imageUrl}" alt="Thumbnail">`;
        thumbItem.addEventListener('click', () => {
            detailMainImage.src = portfolio.imageUrl; // 클릭 시 메인 이미지 변경
            // 모든 썸네일에서 active 클래스 제거 후 클릭된 썸네일에 추가
            document.querySelectorAll('.detail-thumbnail-item').forEach(item => item.classList.remove('active'));
            thumbItem.classList.add('active');
        });
        detailThumbnailsContainer.appendChild(thumbItem);
    }


    detailAuthor.textContent = portfolio.author;
    detailPostTime.textContent = '30분 전 작성됨'; // 더미 데이터에 작성 시간 추가 필요 (현재는 고정)
    detailLanguage.textContent = portfolio.language;
    detailDate.textContent = portfolio.date;
    detailGithub.textContent = portfolio.github || 'N/A';
    if (portfolio.github) {
        detailGithub.innerHTML = `<a href="https://${portfolio.github}" target="_blank">${portfolio.github}</a>`;
    } else {
        detailGithub.textContent = 'N/A';
    }


    detailTags.textContent = portfolio.tags ? portfolio.tags.join(' ') : 'N/A';
    detailDescription.innerHTML = portfolio.description ? portfolio.description.replace(/\n/g, '<br>') : '상세 설명이 없습니다.'; // 줄바꿈 처리

    // 댓글 렌더링
    renderComments(portfolio.comments);

    detailModalOverlay.classList.add('show'); // 상세 모달 표시
}

// 댓글 렌더링 함수
function renderComments(comments) {
    detailCommentCount.textContent = `${comments.length} 개의 댓글`;
    detailCommentsList.innerHTML = '';
    comments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');
        commentItem.innerHTML = `
            <div class="comment-author">${comment.author}</div>
            <div class="comment-meta">${comment.time}</div>
            <div class="comment-content">${comment.content}</div>
            <div class="comment-actions">
              <button>Like</button>
              <button>Reply</button>
            </div>
        `;
        detailCommentsList.appendChild(commentItem);
    });
}

// 댓글 제출 기능 (임시)
submitCommentBtn.addEventListener('click', () => {
    const commentText = commentInput.value.trim();
    if (commentText) {
        // 실제 데이터에 댓글 추가하는 로직 필요
        // 여기서는 임시로 화면에만 추가
        const newComment = { author: '현재 사용자', time: '방금 전', content: commentText };
        // 현재 열려있는 포트폴리오의 댓글 목록에 추가해야 하지만,
        // 여기서는 임시로 상세 모달의 댓글 목록에만 반영
        const tempComments = Array.from(detailCommentsList.children).map(item => ({
            author: item.querySelector('.comment-author').textContent,
            time: item.querySelector('.comment-meta').textContent,
            content: item.querySelector('.comment-content').textContent
        }));
        tempComments.push(newComment);
        renderComments(tempComments); // 다시 렌더링
        commentInput.value = ''; // 입력 필드 초기화
    }
});


// 모달 show/hide (포트폴리오 등록)
writeBtn.onclick = () => {
    modalOverlay.classList.add('show');
    // 폼 초기화
    portfolioForm.reset();
    previewImage.src = 'https://placehold.co/350x180?text=이미지'; // 미리보기 이미지 초기화
};
modalClose.onclick = () => {
    modalOverlay.classList.remove('show');
};

// 상세 모달 닫기
detailModalClose.onclick = () => {
    detailModalOverlay.classList.remove('show');
};


// 포트폴리오 제출 (임시)
portfolioForm.onsubmit = (e) => {
    e.preventDefault();
    // 폼 데이터 가져오기
    const title = document.getElementById('portfolioTitle').value;
    const author = document.getElementById('portfolioAuthor').value;
    const language = document.getElementById('portfolioLanguage').value;
    const date = document.getElementById('portfolioDate').value;
    const github = document.getElementById('portfolioGithub').value;
    const tags = document.getElementById('portfolioTags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const description = document.getElementById('portfolioDescription').value;
    const categoryCheckboxes = document.querySelectorAll('input[name="portfolioCategory"]:checked');
    const categories = Array.from(categoryCheckboxes).map(cb => cb.value);
    const selectedCategory = categories.length > 0 ? categories[0] : '기타'; // 여러 개 선택 시 첫 번째만 사용하거나 로직 변경 필요

    // 이미지 URL (업로드된 이미지의 Data URL 또는 기본 이미지)
    const imageUrl = previewImage.src.startsWith('data:image') ? previewImage.src : ''; // 업로드된 이미지 사용

    const newPortfolio = {
        id: portfolios.length + 1, // 간단한 ID 생성
        category: selectedCategory,
        title: title,
        author: author,
        imageUrl: imageUrl,
        language: language,
        date: date,
        github: github,
        tags: tags,
        description: description,
        comments: [] // 새 포트폴리오에는 댓글 없음
    };

    portfolios.unshift(newPortfolio); // 배열 맨 앞에 추가 (최신글)
    renderPortfolioCards(portfolios); // 포트폴리오 목록 다시 렌더링

    alert('포트폴리오가 등록되었습니다!');
    modalOverlay.classList.remove('show'); // 모달 닫기
    portfolioForm.reset(); // 폼 초기화
    previewImage.src = 'https://placehold.co/350x180?text=이미지'; // 이미지 미리보기 초기화
};


// 초기 렌더링
window.onload = () => {
    renderPortfolioCards(portfolios);
};