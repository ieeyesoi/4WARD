async function loadScheduleDetail() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const studentId = localStorage.getItem("studentId");

  if (!id || !studentId) return alert("잘못된 접근입니다.");

  try {
    // 🔥 전체 일정 불러오기
    const res = await fetch("http://localhost:8080/api/schedules");
    if (!res.ok) throw new Error("서버 응답 실패");

    const data = await res.json();
    data.forEach(s => console.log(`id: ${s.id}, studentId: ${s.studentId}`));

    const schedule = data.find(s => s.id === parseInt(id) && s.studentId === studentId);
    if (!schedule) return alert("해당 일정이 존재하지 않거나 접근 권한이 없습니다.");

    // 📌 일정 정보 표시
    document.getElementById("scheduleTitle").textContent = schedule.title;
    document.getElementById("scheduleDesc").textContent = schedule.description;

    // ⏳ 남은 시간 계산
    const now = new Date();
    const target = new Date(`${schedule.date}T${schedule.time}`);
    const diffMs = target - now;

    if (isNaN(target.getTime()) || diffMs <= 0) {
      document.getElementById("remainingTime").textContent = "일정 시간이 지났습니다.";
      return;
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    document.getElementById("remainingTime").textContent =
      `${schedule.title}까지 ${days}일 ${hours}시간 ${minutes}분 남았습니다.`;

    // 🗑 삭제 버튼 조건부 표시
    const deleteBtn = document.getElementById("deleteScheduleBtn");
    if (deleteBtn) {
      deleteBtn.style.display = "inline-block";
      deleteBtn.onclick = async () => {
        const confirmDelete = confirm("정말 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
          const delRes = await fetch(`http://localhost:8080/api/schedules/${schedule.id}?studentId=${studentId}`, {
            method: "DELETE"
          });
          if (!delRes.ok) throw new Error("삭제 실패");

          alert("삭제 완료");
          window.location.href = "schedule.html";
        } catch (err) {
          console.error("삭제 실패", err);
          alert("삭제 실패");
        }
      };
    }

  } catch (err) {
    console.error("일정 상세 불러오기 실패:", err);
    alert("일정 정보를 불러오는 데 실패했습니다.");
  }
}

document.addEventListener("DOMContentLoaded", loadScheduleDetail);
