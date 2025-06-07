document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // 폼 기본 제출 막기

    const studentId = form.querySelector("input[type='text']").value.trim();
    const password = form.querySelector("input[type='password']").value.trim();

    if (!studentId || !password) {
      alert("학번과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId,
          password: password,
        }),
      });

      if (response.ok) {
        const message = await response.text();
        alert("로그인 성공! 🎉\n");
        localStorage.setItem("studentId", studentId); // 학번 저장
        window.location.href = "main.html"; // 로그인 성공 시 이동할 페이지
      } else if (response.status === 401) {
        alert("학번 또는 비밀번호가 올바르지 않습니다.");
      } else {
        alert("서버 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("에러:", error);
      alert("서버에 연결할 수 없습니다.");
    }
  });
});
