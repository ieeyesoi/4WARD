document.addEventListener("DOMContentLoaded", () => {
  const studentId = localStorage.getItem("studentId");
  const userInfo = document.getElementById("user-info");

  console.log("userInfo:", userInfo); // null이면 못 찾은 거야

  if (studentId && userInfo) {
    userInfo.innerHTML = `<i class="fas fa-user"></i> ${studentId}`;
    userInfo.href = "#";
  }
});

async function loadLatestPortfolio() {
  try {
    const res = await fetch("http://localhost:8080/api/portfolios/latest");
    const latest = await res.json();
    if (!latest) return;

    const portfolioCard = document.querySelectorAll(".card")[0];
    portfolioCard.querySelector(".card-content").innerHTML = `
      <p><strong>제목:</strong> ${latest.title}</p>
      <p><strong>작성자:</strong> ${latest.author}</p>
      <p class="card-body">${latest.language || "기술 스택 없음"} 기반 포트폴리오입니다.</p>
    `;
  } catch (err) {
    console.error("포트폴리오 불러오기 실패:", err);
  }
}



async function loadLatestCommunityPost() {
  try {
    const res = await fetch("http://localhost:8080/api/posts/latest");
    const latest = await res.json();
    if (!latest) return;

    const communityCard = document.querySelectorAll(".card")[1];
    const author = (latest.studentId && latest.studentId !== 'anonymous')
      ? latest.studentId
      : '익명';
    communityCard.querySelector(".card-content").innerHTML = `
      <p><strong>제목:</strong> ${latest.title}</p>
      <p><strong>작성자:</strong> ${author}</p>
      <p class="card-body">${latest.content.slice(0, 30)}...더보기</p>
    `;
  } catch (err) {
    console.error("커뮤니티 게시글 불러오기 실패:", err);
  }
}



async function loadNearestSchedule() {
  try {
    const res = await fetch("http://localhost:8080/api/schedules");
    const data = await res.json();
    if (data.length === 0) return;

    const today = new Date();
    today.setHours(0,0,0,0);

    const upcoming = data
      .map(evt => ({ ...evt, dateObj: new Date(evt.date) }))
      .filter(evt => evt.dateObj >= today)
      .sort((a, b) => a.dateObj - b.dateObj);

    if (upcoming.length === 0) return;

    const next = upcoming[0];
    const diff = Math.ceil((next.dateObj - today) / (1000 * 60 * 60 * 24));

    const scheduleCard = document.querySelectorAll(".card")[2];
    scheduleCard.querySelector(".card-content").innerHTML = `
      <p><strong>일정:</strong> ${next.title}</p>
      <p class="card-body">D-${diff === 0 ? "DAY" : diff} - ${next.description}</p>
    `;
  } catch (err) {
    console.error("일정 불러오기 실패:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const studentId = localStorage.getItem("studentId");
  const userInfo = document.getElementById("user-info");
  if (studentId && userInfo) {
    userInfo.innerHTML = `<i class="fas fa-user"></i> ${studentId}`;
    userInfo.href = "#";
  }

  loadLatestPortfolio();
  loadLatestCommunityPost();
  loadNearestSchedule();

});

// 최신 포트폴리오 글로 이동
document.getElementById("portfolio-more").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:8080/api/portfolios/latest");
    if (!res.ok) throw new Error("최신 포트폴리오 조회 실패");

    const latest = await res.json();
    if (latest && latest.id) {
      window.location.href = `portfolio-detail.html?id=${latest.id}`;
    } else {
      alert("등록된 포트폴리오가 없습니다.");
    }
  } catch (err) {
    alert("포트폴리오 데이터를 불러오는 데 실패했습니다.");
    console.error(err);
  }
});



// 최신 커뮤니티 글로 이동
document.getElementById("community-more").addEventListener("click", async (e) => {
   e.preventDefault();
  try {
    const res = await fetch("http://localhost:8080/api/posts/latest");
    if (!res.ok) throw new Error("최신 게시글 조회 실패");

    const latest = await res.json();
    if (latest && latest.id) {
      window.location.href = `post.html?id=${latest.id}`;
    } else {
      alert("등록된 게시글이 없습니다.");
    }
  } catch (err) {
    alert("커뮤니티 데이터를 불러오는 데 실패했습니다.");
    console.error(err);
  }
});





// 최신 스케줄로 이동
document.getElementById("schedule-more").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:8080/api/schedules");
    const data = await res.json();
    if (data.length > 0) {
      const latest = data.sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time))[0];
      // 실제로 상세 페이지가 있다면 window.location.href로 연결해
      window.location.href = `schedule-detail.html?id=${latest.id}&studentId=${latest.studentId}`;

    } else {
      alert("등록된 일정이 없습니다.");
    }
  } catch (err) {
    alert("일정 데이터를 불러오는 데 실패했습니다.");
    console.error(err);
  }
});
