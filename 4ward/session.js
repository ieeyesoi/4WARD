window.addEventListener("load", () => {
  const studentId = localStorage.getItem("studentId");
  const userInfo = document.getElementById("user-info");
  const logoutBtn = document.getElementById("logout-btn");
  const dropdown = document.getElementById("dropdown-content");

  if (userInfo && dropdown) {
    if (studentId) {
      userInfo.innerHTML = `<i class="fas fa-user"></i> ${studentId}`;
      userInfo.href = "#";
      dropdown.style.display = "none";

      const container = document.getElementById("user-dropdown");
      if (container) {
        container.addEventListener("mouseenter", () => {
          dropdown.style.display = "block";
        });
        container.addEventListener("mouseleave", () => {
          dropdown.style.display = "none";
        });
      }
    } else {
      userInfo.innerHTML = `<i class="fas fa-user"></i> 로그인`;
      userInfo.href = "login.html";
      dropdown.style.display = "none";
    }
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
