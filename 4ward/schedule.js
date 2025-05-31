// ────── 예시 데이터 ──────
let events = [
  { id:1, title:'운영체제 개인 과제', date:'2025-06-07', time:'08:00', desc:'세부 내용' },
  { id:2, title:'웹소 게임 개발 과제', date:'2025-06-11', time:'09:00', desc:'세부 내용' },
  { id:3, title:'웹소 프로젝트 발표', date:'2025-06-23', time:'10:00', desc:'세부 내용' }
];

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

// 날짜 객체
let viewDate = new Date();

// ──────────────── 카드 렌더 ────────────────
function renderCards() {
  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  currentMonth.textContent = monthNames[viewDate.getMonth()];
  cardList.innerHTML = '';
  // 이번달 기준만 표시
  const thisMonthEvents = events.filter(evt => {
    const d = new Date(evt.date);
    return d.getFullYear() === viewDate.getFullYear() && d.getMonth() === viewDate.getMonth();
  });
  // D-day 오름차순 정렬
  thisMonthEvents.sort((a,b) => {
    const da = new Date(a.date), db = new Date(b.date);
    return da - db;
  });
  thisMonthEvents.forEach(evt => {
    const d = new Date(evt.date);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diff = Math.ceil((d - today)/(1000*60*60*24));
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <h3>${evt.title}</h3>
      <div class="dday">D${diff>0? '-' + diff : diff === 0 ? '-DAY' : '+' + Math.abs(diff)}</div>
      <p>${evt.desc}</p>
    `;
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

  // 1일 요일, 마지막 날짜
  const firstDay = new Date(y, m, 1).getDay(); // 0:일~6:토
  const lastDate = new Date(y, m+1, 0).getDate();

  calendarDates.innerHTML = '';

  // 앞쪽 빈칸 (월~일: 0~6 → Mon 시작은 1, 일요일은 0이므로 -1 처리)
  let blanks = (firstDay + 6) % 7;
  for(let i=0; i<blanks; i++) {
    const blank = document.createElement('span');
    blank.className = 'mini-date';
    blank.innerHTML = '&nbsp;';
    calendarDates.append(blank);
  }
  // 날짜
  for(let d=1; d<=lastDate; d++) {
    const dateObj = new Date(y, m, d);
    const mini = document.createElement('span');
    mini.className = 'mini-date';

    // 오늘
    const now = new Date();
    if (dateObj.toDateString() === now.toDateString()) {
      mini.classList.add('mini-date-today');
    }
    // 이벤트 있는 날
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
  // 이번 주의 월요일 날짜
  const curr = new Date(viewDate);
  const weekStart = new Date(curr.setDate(curr.getDate() - (curr.getDay()+6)%7));
  weekStart.setHours(0,0,0,0);

  // 요일 헤더
  weekDays.innerHTML = '';
  let weekDates = [];
  for (let i=0; i<7; i++) {
    const dt = new Date(weekStart);
    dt.setDate(weekStart.getDate() + i);
    weekDates.push(new Date(dt));
    const div = document.createElement('div');
    div.textContent = `${dt.getDate()} ${dt.toLocaleString('default',{ weekday:'short' })}`;
    // 오늘
    const today = new Date();
    today.setHours(0,0,0,0);
    if(dt.toDateString() === today.toDateString()) {
      div.classList.add('weekday-today');
    }
    // 이벤트
    if(events.some(evt=>{
      const ed = new Date(evt.date);
      return ed.toDateString() === dt.toDateString();
    })) {
      div.classList.add('weekday-event');
    }
    weekDays.append(div);
  }

  // 타임라인: 00:00 ~ 23:30 (30분 단위 48칸)
  dayTimeline.innerHTML = '';
  dayTimeline.style.height = (48 * 40) + 'px'; // 40px per row

  for(let i=0; i<48; i++) {
    const hour = String(Math.floor(i/2)).padStart(2,'0');
    const min = i%2 === 0 ? '00' : '30';
    const row = document.createElement('div');
    row.className = 'timeline-row';
    // 시간 라벨
    const timeSpan = document.createElement('span');
    timeSpan.className = 'timeline-time';
    timeSpan.textContent = `${hour}:${min}`;
    row.append(timeSpan);
    // 이벤트가 있으면 표시 (각 요일별)
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
        evDiv.style.left = `calc(${j} * 13% + 5rem)`; // 7칸(요일) 중 해당 요일 위치, left offset 보정
        evDiv.innerHTML = `<b>${evt.title}</b>
          <div style="font-size:0.92em;">${evt.time}<br>${evt.desc}</div>`;
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
eventForm.addEventListener('submit', ev => {
  ev.preventDefault();
  events.push({
    id: events.length+1,
    title: evtTitle.value.trim(),
    date: evtDate.value,
    time: evtTime.value,
    desc: evtDesc.value.trim()
  });
  modalOverlay.classList.remove('active');
  renderAll();
});

// ──────────────── 렌더 올 ────────────────
function renderAll() {
  renderCards();
  renderMiniCalendar();
  renderWeekTimeline();
}

// ──────────────── 최초 호출 ────────────────
window.addEventListener('DOMContentLoaded', renderAll);
