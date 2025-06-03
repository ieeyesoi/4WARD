// mypage.js

// 탭 전환 기능
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 모든 탭 버튼에서 'active' 클래스 제거
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // 클릭된 버튼에 'active' 클래스 추가
        button.classList.add('active');

        // 모든 탭 콘텐츠 숨기기
        tabContents.forEach(content => content.classList.add('hidden'));

        // 클릭된 버튼의 'data-tab' 속성에 해당하는 콘텐츠 보이기
        const targetTabId = button.dataset.tab + 'Tab';
        document.getElementById(targetTabId).classList.remove('hidden');

        // 캘린더 탭으로 전환될 때 캘린더를 다시 렌더링하여 그리드 표시 오류 방지
        if (button.dataset.tab === 'calendar') {
            renderCalendar();
        }
    });
});

// ===============================================
// 포트폴리오 탭 관련 기능
// ===============================================

// 더미 사용자 포트폴리오 데이터
// 이 데이터는 image_8ee5f5.png의 하단 포트폴리오 카드와 유사하게 구성됩니다.
const userPortfolios = [
    {
        id: 1,
        title: '포트폴리오 제목',
        author: '작성자',
        imageUrl: 'https://placehold.co/280x180?text=포트폴리오1', // 플레이스홀더 이미지 URL
        commentsCount: 3
    },
    {
        id: 2,
        title: '포트폴리오 제목',
        author: '작성자',
        imageUrl: 'https://placehold.co/280x180?text=포트폴리오2',
        commentsCount: 3
    },
    {
        id: 3,
        title: '포트폴리오 제목',
        author: '작성자',
        imageUrl: 'https://placehold.co/280x180?text=포트폴리오3',
        commentsCount: 3
    },
    {
        id: 4,
        title: '포트폴리오 제목',
        author: '작성자',
        imageUrl: 'https://placehold.co/280x180?text=포트폴리오4',
        commentsCount: 5
    }
    // 필요한 만큼 더 많은 더미 데이터 추가 가능
];

// 포트폴리오 그리드 컨테이너 선택 (포트폴리오 탭 내부에 있습니다)
const portfolioGrid = document.querySelector('#portfolioTab .mypage-portfolio-grid');

function renderUserPortfolios() {
    portfolioGrid.innerHTML = ''; // 기존 내용 초기화

    // 포트폴리오 데이터가 없는 경우 메시지 표시
    if (userPortfolios.length === 0) {
        portfolioGrid.innerHTML = '<p class="no-events-message">등록된 포트폴리오가 없습니다.</p>';
        return;
    }

    // 각 포트폴리오 데이터를 기반으로 카드 생성 및 추가
    userPortfolios.forEach(portfolio => {
        const card = document.createElement('div');
        card.classList.add('portfolio-card'); // mypage.css에 정의된 공통 카드 스타일 사용

        // 이미지 URL이 없으면 기본 플레이스홀더 아이콘 표시
        const imageContent = portfolio.imageUrl
            ? `<img src="${portfolio.imageUrl}" alt="${portfolio.title}">`
            : '🖼️'; // Fallback to emoji if no image

        card.innerHTML = `
            <div class="portfolio-card__image">
                ${imageContent}
            </div>
            <div class="portfolio-card__info">
                <div class="portfolio-card__category">${portfolio.author}</div>
                <div class="portfolio-card__title">${portfolio.title}</div>
                <div class="portfolio-card__comments">💬 ${portfolio.commentsCount}</div>
            </div>
        `;
        // 클릭 시 포트폴리오 상세 페이지로 이동하는 로직 추가 가능 (예시)
        // card.addEventListener('click', () => { window.location.href = `portfolio-detail.html?id=${portfolio.id}`; });
        portfolioGrid.appendChild(card);
    });
}

// ===============================================
// 캘린더 탭 관련 기능
// ===============================================

const currentMonthYearDisplay = document.getElementById('currentMonthYear');
const calendarGrid = document.querySelector('#calendarTab .calendar-grid'); // 캘린더 그리드 선택자를 캘린더 탭 내부로 한정
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const upcomingEventsList = document.getElementById('upcomingEvents'); // 다가오는 일정 목록 선택자를 캘린더 탭 내부로 한정

let currentMonth = new Date(); // 현재 달을 기준으로 캘린더 시작

// 더미 이벤트 데이터 (날짜는 YYYY-MM-DD 형식으로 정확히 일치시켜야 함)
// image_8ee5dc.png에 있는 이벤트 날짜에 맞춰 수정
const events = [
    { date: '2025-06-06', title: '운영체제 2차 과제 D-8', time: '10:00 - 11:00 AM', link: '#' }, // 이미지의 6일
    { date: '2025-06-10', title: '팀워크 일지 작성 D-14', time: '1:00 - 2:00 PM', link: '#' }, // 이미지의 10일
    { date: '2025-06-25', title: '캡스톤 디자인 발표', time: '오후 3:00', link: '#' },
    { date: '2025-07-05', title: '여름방학 시작', time: '하루 종일', link: '#' }
];

function renderCalendar() {
    // 캘린더 그리드의 요일 헤더를 제외한 모든 날짜 셀을 초기화
    // (요일 헤더는 HTML에 고정되어 있으므로, JS에서 다시 추가할 필요 없음)
    // 기존에 추가된 날짜 셀만 지우기 위해 첫 7개(요일) 이후부터 삭제
    while (calendarGrid.children.length > 7) {
        calendarGrid.removeChild(calendarGrid.lastChild);
    }

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth(); // 0부터 11까지 (0 = 1월, 5 = 6월)

    // 현재 월 및 연도 표시 업데이트 (예: "June 2025")
    currentMonthYearDisplay.textContent = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // 해당 월의 첫째 날과 마지막 날 정보
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0); // 다음 달의 0번째 날 = 현재 달의 마지막 날
    const numDaysInMonth = lastDayOfMonth.getDate(); // 현재 달의 총 일수

    // 캘린더 시작 요일 계산 (월요일이 첫 번째 칸이 되도록 조정)
    // JavaScript의 getDay()는 일요일(0)부터 토요일(6)까지 반환
    // 우리 캘린더는 월요일(첫째 칸)부터 시작하므로:
    // 일요일(0)은 6 (마지막 칸)으로 매핑
    // 월요일(1)은 0 (첫째 칸)으로 매핑
    let startDayOfWeek = firstDayOfMonth.getDay();
    if (startDayOfWeek === 0) { // 일요일인 경우
        startDayOfWeek = 6; // 월요일 시작 그리드에서 6번째 칸 (일요일)
    } else {
        startDayOfWeek--; // 월요일(1) -> 0, 화요일(2) -> 1, ... 토요일(6) -> 5
    }

    // 이전 달의 날짜들을 캘린더에 추가 (빈 칸 채우기용)
    const prevMonthLastDay = new Date(year, month, 0).getDate(); // 이전 달의 마지막 날짜
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'prev-month', 'empty'); // 'empty' 클래스로 클릭 비활성 및 회색 처리
        dayDiv.textContent = prevMonthLastDay - i;
        calendarGrid.appendChild(dayDiv);
    }

    // 현재 달의 날짜들을 캘린더에 추가
    const today = new Date();
    // 오늘 날짜를 YYYY-MM-DD 형식으로 포맷하여 비교에 사용
    const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let day = 1; day <= numDaysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'current-month');
        dayDiv.textContent = day;

        // 현재 날짜를 YYYY-MM-DD 형식으로 포맷
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayDiv.dataset.fullDate = fullDate; // data-full-date 속성에 날짜 저장

        // 이벤트 유무 확인 및 'has-event' 클래스 추가
        const hasEvent = events.some(event => event.date === fullDate);
        if (hasEvent) {
            dayDiv.classList.add('has-event');
        }

        // 오늘 날짜 표시 (today 클래스 추가)
        if (fullDate === todayFormatted) {
            dayDiv.classList.add('today');
        }

        // 날짜 클릭 이벤트 리스너 추가
        dayDiv.addEventListener('click', (e) => {
            // 모든 날짜 셀에서 'selected' 클래스 제거 (기존 선택 해제)
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            // 클릭된 날짜에 'selected' 클래스 추가
            e.currentTarget.classList.add('selected');
            // 선택된 날짜의 이벤트 목록 렌더링
            renderEventsForDate(e.currentTarget.dataset.fullDate);
        });

        calendarGrid.appendChild(dayDiv);
    }

    // 다음 달의 날짜들을 캘린더에 추가 (그리드를 7의 배수로 채우기 위함)
    const totalCellsFilled = calendarGrid.children.length - 7; // 요일 헤더를 제외한 현재 채워진 셀 수
    const remainingCells = (7 - (totalCellsFilled % 7)) % 7; // 다음 달에서 채워야 할 셀 수

    for (let i = 1; i <= remainingCells; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'next-month', 'empty'); // 'empty' 클래스로 클릭 비활성 및 회색 처리
        dayDiv.textContent = i;
        calendarGrid.appendChild(dayDiv);
    }

    // 캘린더 렌더링 후, 오늘 날짜 또는 현재 달의 첫 날을 자동으로 선택하고 이벤트 렌더링
    // 오늘 날짜가 2025-06-02 (월요일)이므로, 6월 2일이 `today`로 표시되고 `selected`되어야 함.
    let initialSelectedDay = null;
    if (year === today.getFullYear() && month === today.getMonth()) {
        // 현재 달이 '오늘'이 포함된 달인 경우
        initialSelectedDay = document.querySelector(`.calendar-day.today`);
    } else {
        // 현재 달이 '오늘'이 포함된 달이 아닌 경우, 현재 표시되는 달의 첫 번째 날을 선택
        initialSelectedDay = document.querySelector(`.calendar-day.current-month:first-of-type`);
    }

    if(initialSelectedDay) {
        // 모든 'selected' 클래스 제거 후, 초기 선택 날짜에 'selected' 클래스 추가
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        initialSelectedDay.classList.add('selected');
        renderEventsForDate(initialSelectedDay.dataset.fullDate);
    } else {
        // 오늘 날짜나 현재 달의 날짜가 없는 경우 (극히 드물지만 예외 처리)
        upcomingEventsList.innerHTML = '<p class="no-events-message">일정을 불러올 수 없습니다.</p>';
    }
}

// 특정 날짜의 이벤트 목록을 렌더링하는 함수
function renderEventsForDate(selectedDate) {
    upcomingEventsList.innerHTML = ''; // 기존 이벤트 목록 초기화

    // 선택된 날짜에 해당하는 이벤트 필터링
    const eventsForSelectedDate = events.filter(event => event.date === selectedDate);

    // 해당 날짜에 이벤트가 없는 경우 메시지 표시
    if (eventsForSelectedDate.length === 0) {
        upcomingEventsList.innerHTML = '<p class="no-events-message">선택된 날짜에 일정이 없습니다.</p>';
        return;
    }

    // 각 이벤트를 기반으로 아이템 생성 및 추가
    eventsForSelectedDate.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.classList.add('event-item');
        eventItem.innerHTML = `
            <div class="event-time">🕒 ${event.time}</div>
            <div class="event-title">${event.title}</div>
            <button class="event-detail-btn">자세히 보기</button>
        `;
        // '자세히 보기' 버튼 클릭 시 이벤트 처리 (예: 상세 모달 열기)
        eventItem.querySelector('.event-detail-btn').addEventListener('click', () => {
            alert(`이벤트 상세: ${event.title}\n시간: ${event.time}\n(실제 상세 페이지로 연결)`);
            // 실제 애플리케이션에서는 여기에 상세 모달을 띄우거나 이벤트 상세 페이지로 이동하는 로직을 구현합니다.
        });
        upcomingEventsList.appendChild(eventItem);
    });
}

// 이전 달 이동 버튼 클릭 이벤트 리스너
prevMonthBtn.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1); // 현재 월을 1 감소
    renderCalendar(); // 캘린더 다시 렌더링
});

// 다음 달 이동 버튼 클릭 이벤트 리스너
nextMonthBtn.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1); // 현재 월을 1 증가
    renderCalendar(); // 캘린더 다시 렌더링
});


// 페이지 로드 시 초기화 및 첫 렌더링 실행
window.onload = () => {
    renderUserPortfolios(); // 포트폴리오 카드 렌더링
    renderCalendar();       // 캘린더 렌더링
};