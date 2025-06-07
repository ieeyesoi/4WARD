window.onload = async () => {
  const studentId = localStorage.getItem("studentId");

  if (!studentId) {
    alert("로그인이 필요합니다.");
    location.href = "login.html";
    return;
  }

  // ✅ 서버에서 사용자 정보 불러오기
  try {
    const res = await fetch(`http://localhost:8080/api/user/${studentId}`);
    const user = await res.json();

    document.getElementById("studentId").value = user.studentId || "";
    document.getElementById("year").value = user.year || "";
    document.getElementById("semester").value = user.semester || "";
    document.getElementById("major").value = user.major || "";
    document.getElementById("techStack").value = user.techStack || "";
    document.getElementById("github").value = user.github || "";

  } catch (err) {
    console.error("사용자 정보 불러오기 실패:", err);
    alert("사용자 정보를 불러올 수 없습니다.");
  }

  // ✅ 저장 버튼 동작
  document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const year = document.getElementById("year").value;
    const semester = document.getElementById("semester").value;
    const major = document.getElementById("major").value;
    const techStack = document.getElementById("techStack").value;
    const github = document.getElementById("github").value;

    try {
      const res = await fetch(`http://localhost:8080/api/user/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, semester, major, techStack, github })
      });

      if (res.ok) {
        alert("프로필이 성공적으로 수정되었습니다!");
        location.href = "mypage.html";
      } else {
        alert("수정 실패. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("수정 에러:", err);
      alert("서버 오류 발생");
    }
  });
};
