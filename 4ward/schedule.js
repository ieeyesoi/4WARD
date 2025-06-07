// ────── 예시 데이터 ──────
let events = [];

async function loadEvents() {
  try {
    const studentId = localStorage.getItem("studentId"); // 🔥 현재 로그인한 유저 ID 가져오기
    const res = await fetch(`http://localhost:8080/api/schedules?studentId=${studentId}`); // ✅ 본인 일정만 요청
    if (!res.ok) throw new Error("불러오기 실패");
    events = await res.json();
    renderAll();
  } catch (err) {
    console.error("일정 불러오기 실패", err);
  }
}


const cardList     = document.getElementById('cardList');
const eventCount   = document.getElementById('eventCount');
const currentMonth = document.getElementById('currentMonth');

const calYear      = document.getElementById('calYear');
const calMonth     = document.getElementById('calMonth');
const calendarDates= document.getElementById('calendarDates');
const calPrev      = document.getElementById('calPrev');
const calNext      = document.getElementById('calNext');

const prevWeekBtn  = document.getElementById('prevWeek');
const nextWeekBtn  = document.getElementById('nextWeek');
const todayBtn     = document.getElementById('todayBtn');
const addEventBtn  = document.getElementById('addEventBtn');
const weekLabel    = document.getElementById('weekLabel');
const weekDays     = document.getElementById('weekDays');
const dayTimeline  = document.getElementById('dayTimeline');

const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const eventForm    = document.getElementById('eventForm');
const evtTitle     = document.getElementById('evtTitle');
const evtDate      = document.getElementById('evtDate');
const evtTime      = document.getElementById('evtTime');
const evtDesc      = document.getElementById('evtDesc');

let viewDate = new Date();

// ──────────────── 카드 렌더 ────────────────
function renderCards() {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  currentMonth.textContent = monthNames[viewDate.getMonth()];
  cardList.innerHTML = '';
  
  const thisMonthEvents = events.filter(evt => {
    const d = new Date(evt.date);
    return d.getFullYear() === viewDate.getFullYear() && d.getMonth() === viewDate.getMonth();
  });

  thisMonthEvents.sort((a,b) => new Date(a.date) - new Date(b.date));

thisMonthEvents.forEach(evt => {
  const d = new Date(evt.date);

  // 🔥 날짜만 비교 (시간 제외)
  const eventDateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((eventDateOnly - today) / (1000 * 60 * 60 * 24));

  const card = document.createElement('div');
  card.className = 'event-card';
  card.innerHTML = `
    <h3>${evt.title}</h3>
    <div class="dday">${diff === 0 ? 'D-DAY' : (diff > 0 ? 'D-' + diff : 'D+' + Math.abs(diff))}</div>
    <p>${evt.description}</p>
    <button class="delete-btn" data-id="${evt.id}">삭제</button>
    `;
    
        // ✅ 카드 클릭 시 상세 페이지로 이동
        card.addEventListener('click', (e) => {
          // 삭제 버튼 클릭 시 이동 방지
          if (e.target.classList.contains('delete-btn')) return;
          window.location.href = `schedule-detail.html?id=${evt.id}`;
        });


    // ✅ 삭제 이벤트 연결
card.querySelector('.delete-btn').addEventListener('click', async () => {
  if (!confirm(`'${evt.title}' 일정을 삭제할까요?`)) return;

  try {
    const studentId = localStorage.getItem("studentId"); // ✅ 여기 추가

    const res = await fetch(`http://localhost:8080/api/schedules/${evt.id}?studentId=${studentId}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("삭제 실패");

    alert("일정이 삭제되었습니다.");
    await loadEvents();
  } catch (err) {
    console.error("삭제 실패:", err);
    alert("삭제 중 오류 발생");
  }
});


    cardList.append(card);
  });

  eventCount.textContent = thisMonthEvents.length;
}


// ──────────────── 미니 캘린더 ────────────────
function renderMiniCalendar() {
  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  calYear.textContent = y;
  calMonth.textContent = String(m+1).padStart(2, '0');

  const firstDay = new Date(y, m, 1).getDay();
  const lastDate = new Date(y, m+1, 0).getDate();
  calendarDates.innerHTML = '';

  let blanks = (firstDay + 6) % 7;
  for(let i=0; i<blanks; i++) {
    const blank = document.createElement('span');
    blank.className = 'mini-date';
    blank.innerHTML = '&nbsp;';
    calendarDates.append(blank);
  }

  for(let d=1; d<=lastDate; d++) {
    const dateObj = new Date(y, m, d);
    const mini = document.createElement('span');
    mini.className = 'mini-date';

    const now = new Date();
    if (dateObj.toDateString() === now.toDateString()) {
      mini.classList.add('mini-date-today');
    }

    if (events.some(evt => {
      const ed = new Date(evt.date);
      return ed.getFullYear()===y && ed.getMonth()===m && ed.getDate()===d;
    })) {
      mini.classList.add('mini-date-event');
    }

    mini.textContent = d;
    calendarDates.append(mini);
  }
}

calPrev.addEventListener('click', () => {
  viewDate.setMonth(viewDate.getMonth() - 1);
  renderAll();
});
calNext.addEventListener('click', () => {
  viewDate.setMonth(viewDate.getMonth() + 1);
  renderAll();
});

// ──────────────── 주간 타임라인 ────────────────
function renderWeekTimeline() {
  const curr = new Date(viewDate);
  const weekStart = new Date(curr.setDate(curr.getDate() - (curr.getDay()+6)%7));
  weekStart.setHours(0,0,0,0);

  weekDays.innerHTML = '';
  let weekDates = [];
  for (let i=0; i<7; i++) {
    const dt = new Date(weekStart);
    dt.setDate(weekStart.getDate() + i);
    weekDates.push(new Date(dt));
    const div = document.createElement('div');
    div.textContent = `${dt.getDate()} ${dt.toLocaleString('default',{ weekday:'short' })}`;
    const today = new Date();
    today.setHours(0,0,0,0);
    if(dt.toDateString() === today.toDateString()) div.classList.add('weekday-today');
    if(events.some(evt => new Date(evt.date).toDateString() === dt.toDateString())) div.classList.add('weekday-event');
    weekDays.append(div);
  }

  dayTimeline.innerHTML = '';
  dayTimeline.style.height = (48 * 40) + 'px';

  for(let i=0; i<48; i++) {
    const hour = String(Math.floor(i/2)).padStart(2,'0');
    const min = i%2 === 0 ? '00' : '30';
    const row = document.createElement('div');
    row.className = 'timeline-row';
    const timeSpan = document.createElement('span');
    timeSpan.className = 'timeline-time';
    timeSpan.textContent = `${hour}:${min}`;
    row.append(timeSpan);

    for(let j=0; j<7; j++) {
      const dt = weekDates[j];
      const eventsForTime = events.filter(evt=>{
        const ed = new Date(evt.date+'T'+evt.time);
        return ed.getFullYear()===dt.getFullYear() && ed.getMonth()===dt.getMonth() &&
               ed.getDate()===dt.getDate() && ed.getHours()===parseInt(hour) && ed.getMinutes()===parseInt(min);
      });
      eventsForTime.forEach(evt=>{
        const evDiv = document.createElement('div');
        evDiv.className = 'timeline-event';
        evDiv.style.left = `calc(${j} * 13% + 5rem)`;
        evDiv.innerHTML = `<b>${evt.title}</b>
          <div style="font-size:0.92em;">${evt.time}<br>${evt.description}</div>`;
        row.append(evDiv);
      });
    }
    dayTimeline.append(row);
  }
}

prevWeekBtn.addEventListener('click', () => {
  viewDate.setDate(viewDate.getDate() - 7);
  renderAll();
});
nextWeekBtn.addEventListener('click', () => {
  viewDate.setDate(viewDate.getDate() + 7);
  renderAll();
});
todayBtn.addEventListener('click', () => {
  viewDate = new Date();
  renderAll();
});

// ──────────────── 이벤트 추가 ────────────────
addEventBtn.addEventListener('click', () => {
  modalOverlay.classList.add('active');
});
modalClose.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});
eventForm.addEventListener('submit', async ev => {
  ev.preventDefault();
  const studentId = localStorage.getItem("studentId"); // ✅ 추가
  const newEvent = {
    studentId,
    title: evtTitle.value.trim(),
    date: evtDate.value,
    time: evtTime.value,
    description: evtDesc.value.trim()
  };

  try {
    const res = await fetch("http://localhost:8080/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent)
    });
    if (!res.ok) throw new Error("추가 실패");

    modalOverlay.classList.remove('active');
    await loadEvents(); // ← 새로고침
  } catch (err) {
    alert("일정 추가 실패");
    console.error(err);
  }
});

// ──────────────── 렌더 올 ────────────────
function renderAll() {
  renderCards();
  renderMiniCalendar();
  renderWeekTimeline();
}

// ──────────────── 최초 호출 ────────────────
window.addEventListener('DOMContentLoaded', async () => {
  viewDate = new Date();
  await loadEvents(); // ✅ 정상 작동
});

