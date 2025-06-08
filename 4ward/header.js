fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    const studentId = localStorage.getItem("studentId");
    const userInfo = document.getElementById("user-info");
    const logoutBtn = document.getElementById("logout-btn");
    const dropdownContent = document.getElementById("dropdown-content");

    if (studentId && userInfo) {
      // 로그인 된 경우: ID 표시 + 드롭다운 유지
      userInfo.innerHTML = `<i class="fas fa-user"></i> ${studentId}`;
      userInfo.href = "#";
    } else {
      // 로그인 안 된 경우: 드롭다운 숨기고 로그인 페이지로 이동 가능하게 함
      if (dropdownContent) dropdownContent.style.display = "none";
      if (userInfo) userInfo.href = "login.html";
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("studentId");
        alert("로그아웃 되었습니다.");
        window.location.href = "login.html";
      });
    }
  });
