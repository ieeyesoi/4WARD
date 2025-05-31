// js/app.js

// ───────────────────────────────────────────
// 1) 예시 초기 데이터 & 상태 변수
// ───────────────────────────────────────────
const exampleRooms = [
  { id:'S4-15', category:'major',   name:'운영체제',      prof:'김철수', building:'S4-15', room:'101', lat:36.63715, lng:127.48920 },
  { id:'N14',   category:'major',   name:'컴퓨터구조',    prof:'이영희', building:'N14',   room:'202', lat:36.63800, lng:127.49010 },
  // … 필요에 따라 추가
];
let userRooms   = exampleRooms.slice();
let map, markers = [], tempLatLng = null;

// DOM 참조
const listEl          = document.getElementById('list');
const formContainer   = document.getElementById('formContainer');
const addRoomForm     = document.getElementById('addRoomForm');
const cancelBtn       = document.getElementById('cancelBtn');
const categorySelect  = document.getElementById('categorySelect');
const roomNameInput   = document.getElementById('roomNameInput');
const profNameInput   = document.getElementById('profNameInput');
const buildingInput   = document.getElementById('buildingNumberInput');
const roomNumberInput = document.getElementById('roomNumberInput');

// ───────────────────────────────────────────
// 2) 지도 초기화 (클릭 시 폼 오픈 포함)
// ───────────────────────────────────────────
function initMap() {
  // 1) Geolocation 사용 가능 여부 확인
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        // 성공 시 현재 위치로 지도 생성
        const userLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        createMap(userLatLng);
        console.log('Success');
      },
      error => {
        console.warn('Geolocation error:', error);
        // 실패 시 기본 위치로 지도 생성
        createMap({ lat: 36.637, lng: 127.489 });
      }
    );
  } else {
    // Geolocation 미지원 시 기본 위치로 지도 생성
    createMap({ lat: 36.637, lng: 127.489 });
    console.log('Geolocation is not supported by this browser.');
  }
}

// 실제로 지도를 만드는 함수
function createMap(centerLatLng) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: centerLatLng,
    zoom: 20,
    disableDefaultUI: true
  });

  // 클릭 시 폼 열기 (기존 로직)
  map.addListener('click', e => {
    tempLatLng = e.latLng;
    formContainer.classList.remove('hidden');
  });

  // 마커 렌더링 위해 리스트 갱신
  updateRoomList();
}

// ───────────────────────────────────────────
// 3) 리스트 & 마커 갱신 함수 (updateRoomList)
// ───────────────────────────────────────────
function updateRoomList() {
  // 기존 마커 제거
  markers.forEach(m => m.setMap(null));
  markers = [];
  // 리스트 초기화
  listEl.innerHTML = '';

  const typeFilter = document.querySelector('.tab-btn.active').dataset.type;
  const kw         = document.getElementById('searchInput').value.trim().toLowerCase();

  userRooms
    .filter(r =>
      r.category === typeFilter &&
      (`${r.building} ${r.name} ${r.prof} ${r.room}`)
        .toLowerCase().includes(kw)
    )
    .forEach(room => {
      // — 리스트 아이템 생성
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="building-item__header">${room.building}</div>
        <div class="building-item__detail">
          ${room.name} / ${room.prof} / ${room.room}
        </div>
        <div class="building-item__actions">
          <button class="select-btn">선택</button>
        </div>
      `;
      // 삭제 버튼
      const del = document.createElement('button');
      del.className   = 'del-btn';
      del.dataset.id  = room.id;
      del.textContent = '삭제';
      li.appendChild(del);

      // 선택 클릭 → 패닝, 줌 20, InfoWindow 열기, 하이라이트
      li.querySelector('.select-btn').addEventListener('click', () => {
        map.panTo({ lat: room.lat, lng: room.lng });
        map.setZoom(20);

        // 해당 마커 찾아서 InfoWindow 열기
        const mk = markers.find(m => m._id === room.id);
        if (mk && mk.infoWindow) {
          mk.infoWindow.open(map, mk);
        }

        // 리스트 하이라이트
        document.querySelectorAll('.building-list li')
                .forEach(el => el.classList.remove('active'));
        li.classList.add('active');
      });

      // 삭제 클릭
      del.addEventListener('click', ev => {
        ev.stopPropagation();
        userRooms = userRooms.filter(r => r.id !== room.id);
        updateRoomList();
      });

      listEl.appendChild(li);

      // — 마커 생성 및 InfoWindow 설정
      const marker = new google.maps.Marker({
        position: { lat: room.lat, lng: room.lng },
        map,
        title: room.building
      });
      marker._id = room.id;
      marker.infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-weight:600;">${room.name}</div>`
      });
      markers.push(marker);
    });
}

// ───────────────────────────────────────────
// 4) UI 바인딩 (탭, 검색, 폼 핸들링)
// ───────────────────────────────────────────
function bindUI() {
  // 탭 클릭
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateRoomList();
    });
  });
  // 검색 입력
  document.getElementById('searchInput').addEventListener('input', updateRoomList);

  // 폼 제출 → 새 강의실 추가
  addRoomForm.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!tempLatLng) return;
    const newRoom = {
      id:       `r${Date.now()}`,
      category: categorySelect.value,
      name:     roomNameInput.value.trim(),
      prof:     profNameInput.value.trim(),
      building: buildingInput.value.trim(),
      room:     roomNumberInput.value.trim(),
      lat:      tempLatLng.lat(),
      lng:      tempLatLng.lng()
    };
    userRooms.push(newRoom);
    tempLatLng = null;
    addRoomForm.reset();
    formContainer.classList.add('hidden');
    updateRoomList();
  });

  // 폼 취소
  cancelBtn.addEventListener('click', () => {
    tempLatLng = null;
    addRoomForm.reset();
    formContainer.classList.add('hidden');
  });
}

// ───────────────────────────────────────────
// 5) 초기 실행
// ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  bindUI();
});
