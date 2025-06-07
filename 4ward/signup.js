// signup.js
document.getElementById("signup-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // ✅ 입력값 가져오기
  const name = document.getElementById("name").value;
  const studentId = document.getElementById("studentId").value;
  const password = document.getElementById("password").value;
  const major = document.getElementById("major").value;
  const year = document.getElementById("year").value;
  const semester = document.getElementById("semester").value;

  // ✅ 빈칸 체크
  if (!name) {
    alert("이름을 입력해주세요.");
    return;
  }
  if (!studentId) {
    alert("학번을 입력해주세요.");
    return;
  }
  if (!password) {
    alert("비밀번호를 입력해주세요.");
    return;
  }
  if (!major) {
    alert("전공을 선택해주세요.");
    return;
  }
  if (!year) {
    alert("학년을 선택해주세요.");
    return;
  }
  if (!semester) {
    alert("학기를 선택해주세요.");
    return;
  }

  // ✅ 학번 유효성 검사: 숫자 10자리
  const studentIdRegex = /^\d{10}$/;
  if (!studentIdRegex.test(studentId)) {
    alert("학번은 10자리 숫자만 입력 가능합니다.");
    return;
  }

  // ✅ 회원가입 요청
  const response = await fetch("http://127.0.0.1:8080/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      studentId: studentId,
      password: password,
      major: major,
      year: year,
      semester: semester
    })
  });

  // ✅ 결과 처리
  if (response.ok) {
    alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
    window.location.href = "login.html";
  } else if (response.status === 409) {
    alert("이미 가입된 학번입니다."); 
  } else {
    alert("회원가입 실패. 다시 시도해주세요.");
  }
});
