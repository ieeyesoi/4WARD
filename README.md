![venom](https://capsule-render.vercel.app/api?type=venom&height=200&text=4%20WARD%20&fontSize=70&color=0:8871e5,100:b678c4&stroke=b678c4)

🔹CBNU SW 포털 (충북대학교 소프트웨어학부 통합 웹 플랫폼) <br>
🔹CBNU Software portal
<br>
### 📬 Contact
![mailcontact](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white) <br>
PM 이예솔 | yesol4138@chungbuk.ac.kr
<br>

### 👥 Team
<table> <tr> <td align="center"> <a href="https://github.com/ieeyesoi"><img src="https://github.com/ieeyesoi.png" width="100px;" alt="이예솔 프로필"/><br /><sub><b>이예솔</b><br />PM / FE</sub></a> </td> <td align="center"> <a href="https://github.com/kdm0927"><img src="https://github.com/kdm0927.png" width="100px;" alt="김다민 프로필"/><br /><sub><b>김다민</b><br />FE / FE</sub></a> </td> <td align="center"> <a href="https://github.com/jaeyeongt"><img src="https://github.com/jaeyeongt.png" width="100px;" alt="조재영 프로필"/><br /><sub><b>조재영</b><br />디자인 / FE</sub></a> </td> <td align="center"> <a href="https://github.com/coalsld"><img src="https://github.com/coalsld.png" width="100px;" alt="허채민"/><br /><sub><b>허채민</b><br />BE</sub></a> </td> </tr> </table>

### 📝 Purpose
충북대학교 소프트웨어학부 학생들이 흩어진 정보를 한곳에서 확인하고 <br>
소통 및 협업을 원활히 할 수 있도록 지원하는 통합 웹 플랫폼 <br>

### 🛠️ Tools
![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white) ![html](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![css](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![react](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) 

![figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) ![java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)

![notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white) Notion 프로젝트 페이지 [notionlink](https://www.notion.so/AI-1fddd2128ec480a8ae75e2b56fd802d8?pvs=4)
<br>
<br></br>
## 🤝 GitHub 협업 전략

본 프로젝트는 팀원 간의 효율적인 협업과 충돌 최소화를 위해 아래와 같은 GitHub 전략을 따릅니다.

---

## 🔧 브랜치 전략

1. 모든 팀원은 자신의 이름을 기준으로 브랜치를 하나씩 생성하여 관리합니다.
2. **`main` 브랜치는 최종 배포용 브랜치**로, 직접 push하지 않고 Pull Request(PR)를 통해서만 병합됩니다.
3. 브랜치 구조 <br> </br><br>
📁 main ← 최종 결과물 </br><br>
├── 📁 yesol ← 예솔의 작업 브랜치</br><br>
├── 📁 jaeyoung ← 재영의 작업 브랜치</br><br>
├── 📁 chaemin ← 채민의 작업 브랜치</br><br>
└── 📁 damin ← 다민의 작업 브랜치 </br><br> </br>

---

### 🚀 작업 방식

1. **자신의 브랜치에서만 작업**합니다.
2. `git pull origin main`으로 최신 상태를 자주 반영합니다.
3. 작업이 완료되면 **PR(Pull Request)**을 생성해 `main` 브랜치로 병합 요청합니다.
4. PR은 팀원 1인 이상의 확인(리뷰) 후 병합합니다.

---

### 🔒 브랜치 보호 규칙

- `main` 브랜치는 다음과 같이 보호됩니다:
  - ✅ PR을 통해서만 병합 가능
  - ✅ 최소 1명 이상의 리뷰 필요
  - ✅ 직접 push 금지

> 👉 이로 인해 **의도치 않은 충돌이나 오류 발생을 사전에 방지**할 수 있습니다.

---

### 🛑 브랜치 접근 규칙

- 다른 팀원의 브랜치에는 **push하지 않습니다.**
- 필요한 경우 `pull`만 허용하여 참고할 수 있습니다.
- 개인 브랜치 내 작업은 **자율적으로 관리**하며, 팀 내 약속된 스타일과 구조를 따릅니다.

---

### 💻 커밋 & PR 규칙

- **의미 있는 커밋 메시지 작성**을 권장합니다.
  - 예: `feat: 리소스 페이지 UI 구현`, `fix: 버튼 정렬 오류 수정`
- PR 제목은 명확하게 작성하며, 설명에는 변경 사항 요약을 포함합니다.

---

### 🧭 예시 워크플로우

```bash
# 1. 브랜치 생성 (최초 1회)
git checkout -b seoyoung

# 2. 작업 & 커밋
git add .
git commit -m "feat: 강의정보 페이지 구현"

# 3. push
git push origin seoyoung

# 4. PR 생성 → main 브랜치로 병합 요청

