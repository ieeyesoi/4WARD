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

async function renderUserPortfolios() {
  const studentId = localStorage.getItem("studentId");
  if (!studentId) return;

  try {
    const res = await fetch("http://localhost:8080/api/portfolios");
    const allPortfolios = await res.json();

    const userPortfolios = allPortfolios.filter(p => p.studentId === studentId);
    const portfolioGrid = document.querySelector('#portfolioTab .mypage-portfolio-grid');
    portfolioGrid.innerHTML = '';

    if (userPortfolios.length === 0) {
      portfolioGrid.innerHTML = '<p class="no-events-message">등록한 포트폴리오가 없습니다.</p>';
      return;
    }

    userPortfolios.forEach(portfolio => {
      const card = document.createElement('div');
      card.classList.add('portfolio-card');

      const imageContent = portfolio.imageUrl
        ? `<img src="${portfolio.imageUrl}" alt="${portfolio.title}">`
        : '🖼️';

      card.innerHTML = `
        <div class="portfolio-card__image">${imageContent}</div>
        <div class="portfolio-card__info">
          <div class="portfolio-card__category">${portfolio.category?.join?.(', ') || ''}</div>
          <div class="portfolio-card__title">${portfolio.title}</div>
          <div class="portfolio-card__comments">💬 댓글 ${portfolio.commentsCount || 0}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        window.location.href = `portfolio-detail.html?id=${portfolio.id}`;
      });

      portfolioGrid.appendChild(card);
    });

  } catch (err) {
    console.error("포트폴리오 불러오기 실패", err);
  }
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


let events = [];

async function fetchScheduleEvents() {
  try {
    const studentId = localStorage.getItem("studentId"); // 🔥 추가
    const res = await fetch(`http://localhost:8080/api/schedules?studentId=${studentId}`); // 🔥 본인 일정만 요청
    if (!res.ok) throw new Error("일정 불러오기 실패");
    const data = await res.json();

    // 마이페이지 캘린더용 포맷
    events = data.map(evt => ({
      id: evt.id,
      date: evt.date,
      title: evt.title,
      time: evt.time,
      desc: evt.description,
      link: '#'  // 추후 상세 페이지 연결 시 사용
    }));

    renderCalendar();
  } catch (err) {
    console.error("마이페이지 일정 불러오기 실패:", err);
  }
}

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
    renderUpcomingEvents();
}

function renderUpcomingEvents() {
  upcomingEventsList.innerHTML = ''; // 초기화

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const endOfMonth = new Date(year, month + 1, 0); // 이번 달 말

  const upcoming = events
    .filter(evt => {
      const evtDate = new Date(evt.date);
      evtDate.setHours(0, 0, 0, 0);
      return evtDate >= today && evtDate <= endOfMonth;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (upcoming.length === 0) {
    upcomingEventsList.innerHTML = '<p class="no-events-message">다가오는 일정이 없습니다.</p>';
    return;
  }

  upcoming.forEach(evt => {
    const d = new Date(evt.date);
    d.setHours(0, 0, 0, 0);
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    const eventItem = document.createElement('div');
    eventItem.classList.add('event-item');
    eventItem.innerHTML = `
      <div class="event-title">📌 ${evt.title}</div>
      <div class="event-time">${diff === 0 ? 'D-DAY' : `D-${diff}`}</div>
      <button class="event-detail-btn">자세히 보기</button>
    `;
      eventItem.querySelector('.event-detail-btn').addEventListener('click', () => {
      window.location.href = `schedule-detail.html?id=${evt.id}`;
    })
    upcomingEventsList.appendChild(eventItem);
  });
}

function renderEventsForDate(selectedDate) {
  upcomingEventsList.innerHTML = '';

  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

const filteredEvents = events
  .filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= selected;
  })
  .sort((a, b) => new Date(a.date) - new Date(b.date)); // 💡 날짜 빠른 순 정렬


  if (filteredEvents.length === 0) {
    upcomingEventsList.innerHTML = '<p class="no-events-message">해당 날짜 이후 일정이 없습니다.</p>';
    return;
  }

  filteredEvents.forEach(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    const diff = Math.ceil((eventDate - selected) / (1000 * 60 * 60 * 24));
    const ddayText = (diff === 0)
      ? 'D-DAY'
      : `D-${diff}`;

    const eventItem = document.createElement('div');
    eventItem.classList.add('event-item');
    eventItem.innerHTML = `
      <div class="event-title">📌 ${event.title}</div>
      <div class="event-time">${ddayText}</div>
      <button class="event-detail-btn">자세히 보기</button>
    `;

    eventItem.querySelector('.event-detail-btn').addEventListener('click', () => {
      window.location.href = `schedule-detail.html?id=${event.id}`;
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
window.onload = async () => {
  renderUserPortfolios();
  await fetchScheduleEvents();
  const studentId = localStorage.getItem("studentId");

  if (studentId) {
    // 사용자 정보 가져오기
    fetch(`http://localhost:8080/api/user/${studentId}`)
      .then(response => response.json())
      .then(user => {
        if (user) {
          document.querySelector(".user-name").textContent = ` ${user.studentId} ${user.name} 님`;

          const gradeElement = document.querySelector(".user-grade");
          if (gradeElement && user.year && user.semester) {
            gradeElement.textContent = `${user.year} ${user.semester}`;
          }


          const majorEl = document.querySelector(".detail-grid div:nth-child(1) p");
          if (majorEl) {
            majorEl.textContent = user.major;
          }

          const techStackEl = document.querySelector(".detail-grid div:nth-child(2) p");
          if (techStackEl) {
            techStackEl.textContent = user.techStack || '없음';
          }

          const githubEl = document.querySelector(".detail-grid div:nth-child(3) a");
          if (githubEl) {
            githubEl.href = user.github || '#';
            githubEl.textContent = user.github ? new URL(user.github).hostname : '없음';
          }
        }
      })
      .catch(err => {
        console.error("사용자 정보 불러오기 실패:", err);
      });
  }

  // 수정 버튼 이벤트
  const editBtn = document.querySelector(".edit-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      location.href = "editprofile.html";
    });
  }
};
