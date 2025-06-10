/**
 * app.js (ES 모듈)
 * 1) requirementsXX.json 로드
 * 2) rawText 파싱 → {code,name,credits} 배열
 * 3) 교양(genEd) / 전공(major) 계산
 * 4) 결과 렌더링 (카드 형태)
 */

 // 1) HTML 요소
const yearSelect      = document.getElementById("yearSelect");
const majorSelect     = document.getElementById("majorSelect");
const courseTextarea  = document.getElementById("courseTextarea");
const calculateBtn    = document.getElementById("calculateBtn");
const resultContainer = document.getElementById("resultContainer");
const genEdResult     = document.getElementById("genEdResult");
const majorResult     = document.getElementById("majorResult");
const overallResult   = document.getElementById("overallResult");

// 2) requirements JSON 로드
async function loadRequirements(year) {
  const fileName = year === "24" ? "requirements24.json" : "requirements25.json";
  try {
    const resp = await fetch(fileName);
    if (!resp.ok) throw new Error("요구사항 JSON 로드 실패");
    return await resp.json();
  } catch (err) {
    console.error(err);
    alert("졸업 요건을 불러오는 중 오류가 발생했습니다.");
    return null;
  }
}

// 3) rawText 파싱
function parseRawText(rawText) {
  const lines = rawText.split("\n").map(l => l.trim()).filter(l => l);
  const courses = [];
  const regex = /^(\d{7,8})\s+(.+?)\s+(\d+)-\d+-\d+$/;
  for (const line of lines) {
    const m = line.match(regex);
    if (m) {
      courses.push({
        code:    m[1],
        name:    m[2].trim(),
        credits: parseInt(m[3], 10)
      });
    } else {
      console.warn(`파싱 불가 라인(무시됨): ${line}`);
    }
  }
  return courses;
}

// 4) 계산 로직
async function calculateRequirements(rawText, requirements, chosenMajor) {
  const userCourses  = parseRawText(rawText);
  const genEdRules   = requirements.genEd.categories;
  const majorRules   = requirements.major[chosenMajor];
  const genEdResultObj = {};
  const majorResultObj = {
    coreRequired: { required: majorRules.coreRequired.minCredits, earned: 0, status: "미충족" },
    electives:   { required: majorRules.electives.minCredits,   earned: 0, status: "미충족" }
  };

  // genEd 초기화
  genEdRules.forEach(cat => {
    if (cat.subcategories) {
      genEdResultObj[cat.name] = {};
      cat.subcategories.forEach(sub => {
        genEdResultObj[cat.name][sub.name] = { required: sub.minCredits, earned: 0, status: "미충족" };
      });
    } else if (cat.fields) {
      genEdResultObj[cat.name] = { required: cat.totalMinCredits, earned: 0, status: "미충족", detail: {} };
      Object.entries(cat.fields).forEach(([fname, fobj]) => {
        genEdResultObj[cat.name].detail[fname] = { minCourses: fobj.minCourses||0, earned:0, status:"미충족" };
      });
    } else if (cat.courses) {
      genEdResultObj[cat.name] = { required: cat.totalMinCredits, earned: 0, status: "미충족" };
    }
  });

  // 매칭 및 누적
  for (const uc of userCourses) {
    const { code, credits } = uc;
    // 전공 매칭
    if (majorRules.coreRequired.courses.some(c=>c.code===code)) {
      majorResultObj.coreRequired.earned += credits; continue;
    }
    if (majorRules.electives.courses.some(c=>c.code===code)) {
      majorResultObj.electives.earned += credits; continue;
    }
    if (Array.isArray(majorRules.otherRecognized) &&
        majorRules.otherRecognized.some(c=>c.code===code)) {
      majorResultObj.electives.earned += credits; continue;
    }
    // 교양 매칭
    for (const cat of genEdRules) {
      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          if (sub.possibleCourses?.some(c=>c.code===code)) {
            genEdResultObj[cat.name][sub.name].earned += credits;
            break;
          }
        }
      } else if (cat.fields) {
        Object.entries(cat.fields).forEach(([fname, fobj]) => {
          if (fobj.possibleCourses.some(c=>c.code===code)) {
            genEdResultObj[cat.name].detail[fname].earned += credits;
            genEdResultObj[cat.name].earned += credits;
          }
        });
      } else if (cat.courses) {
        if (cat.courses.some(c=>c.code===code)) {
          genEdResultObj[cat.name].earned += credits;
        }
      }
    }
  }

  // 상태 계산
  genEdRules.forEach(cat => {
    if (cat.subcategories) {
      cat.subcategories.forEach(sub => {
        const info = genEdResultObj[cat.name][sub.name];
        if (info.earned >= info.required) info.status="충족";
        else { info.status="미충족"; info.missingCredits=info.required-info.earned; }
      });
    } else if (cat.fields) {
      const info = genEdResultObj[cat.name];
      if (info.earned>=info.required) info.status="충족";
      else { info.status="미충족"; info.missingCredits=info.required-info.earned; }
      Object.entries(cat.fields).forEach(([fname,fobj])=>{
        const finfo = info.detail[fname];
        if (finfo.earned >= fobj.minCourses*(fobj.possibleCourses[0]?.credits||3)) {
          finfo.status="충족";
        } else {
          finfo.status="미충족";
          finfo.missingCourses = fobj.minCourses - (finfo.earned/ (fobj.possibleCourses[0]?.credits||3));
        }
      });
    } else if (cat.courses) {
      const info = genEdResultObj[cat.name];
      if (info.earned>=info.required) info.status="충족";
      else { info.status="미충족"; info.missingCredits=info.required-info.earned; }
    }
  });
  // 전공 상태
  ["coreRequired","electives"].forEach(k=>{
    const o = majorResultObj[k];
    if (o.earned>=o.required) o.status="충족";
    else { o.status="미충족"; o.missingCredits=o.required-o.earned; }
  });

  // 전체 계산
  let totalRequired = requirements.genEd.grandTotalCredits + majorRules.totalMinCredits;
  let totalEarned   = 0;
  genEdRules.forEach(cat=>{
    if (cat.subcategories) cat.subcategories.forEach(sub=> totalEarned+=genEdResultObj[cat.name][sub.name].earned);
    else if (cat.fields) totalEarned+=genEdResultObj[cat.name].earned;
    else if (cat.courses) totalEarned+=genEdResultObj[cat.name].earned;
  });
  totalEarned += majorResultObj.coreRequired.earned + majorResultObj.electives.earned;
  const overallStatus = totalEarned>=totalRequired ? "충족":"미충족";

  return { genEd:genEdResultObj, major:{[chosenMajor]:majorResultObj}, overall:{totalRequired,totalEarned,overallStatus} };
}

// 5) 결과 렌더링 (genEdRules 인자로 넘김)
function renderResult(data, genEdRules) {
  resultContainer.hidden = false;
  genEdResult.innerHTML   = "<h3>교양 결과</h3>";
  majorResult.innerHTML   = "<h3>전공 결과</h3>";
  overallResult.innerHTML = "<h3>전체 요건</h3>";

  // 교양
  Object.entries(data.genEd).forEach(([catName, catObj])=>{
    const wrapper = document.createElement("div");
    wrapper.classList.add("result-card");
    const title = document.createElement("p");
    title.classList.add("sub-item");
    title.innerHTML = `<strong>${catName}</strong>`;
    wrapper.appendChild(title);

    const rule = genEdRules.find(c=>c.name===catName);
    if (rule.subcategories) {
      Object.entries(catObj).forEach(([subName,info])=>{
        const p = document.createElement("p");
        p.classList.add("sub-item");
        if (info.status==="충족") {
          p.innerHTML = `${subName}: <span class="status-ok">충족 (${info.earned}/${info.required})</span>`;
        } else {
          p.innerHTML = `${subName}: <span class="status-fail">미충족 (${info.earned}/${info.required}, 부족 ${info.missingCredits}학점)</span>`;
        }
        wrapper.appendChild(p);
      });
    }
    else if (rule.fields) {
      const info = catObj;
      const pAll = document.createElement("p");
      pAll.classList.add("sub-item");
      if (info.status==="충족") {
        pAll.innerHTML = `이수학점: <span class="status-ok">${info.earned}/${info.required} 충족</span>`;
      } else {
        pAll.innerHTML = `<span class="status-fail">미충족 (${info.earned}/${info.required})</span><br>부족학점: ${info.missingCredits}`;
      }
      wrapper.appendChild(pAll);
      Object.entries(info.detail).forEach(([fname,finfo])=>{
        const f = document.createElement("p");
        f.classList.add("sub-item");
        if (finfo.status==="충족") {
          f.innerHTML = `${fname}: <span class="status-ok">충족</span>`;
        } else {
          f.innerHTML = `${fname}: <span class="status-fail">미충족 (필요 ${finfo.minCourses}과목 중 ${finfo.earned/3}과목)</span>`;
        }
        wrapper.appendChild(f);
      });
    }
    else if (rule.courses) {
      const info = catObj;
      const p = document.createElement("p");
      p.classList.add("sub-item");
      if (info.status==="충족") {
        p.innerHTML = `이수학점: <span class="status-ok">${info.earned}/${info.required} 충족</span>`;
      } else {
        p.innerHTML = `<span class="status-fail">미충족 (${info.earned}/${info.required}, 부족 ${info.missingCredits}학점)</span>`;
      }
      wrapper.appendChild(p);
    }

    genEdResult.appendChild(wrapper);
  });

  // 전공
  Object.entries(data.major).forEach(([mName,infoObj])=>{
    const wrapper = document.createElement("div");
    wrapper.classList.add("result-card");
    const title = document.createElement("p");
    title.classList.add("sub-item");
    title.innerHTML = `<strong>${mName} 전공</strong>`;
    wrapper.appendChild(title);

    ["coreRequired","electives"].forEach(key=>{
      const o = infoObj[key];
      const p = document.createElement("p");
      p.classList.add("sub-item");
      const label = key==="coreRequired"?"전공필수":"전공선택";
      if (o.status==="충족") {
        p.innerHTML = `${label}: <span class="status-ok">충족 (${o.earned}/${o.required})</span>`;
      } else {
        p.innerHTML = `${label}: <span class="status-fail">미충족 (${o.earned}/${o.required}, 부족 ${o.missingCredits}학점)</span>`;
      }
      wrapper.appendChild(p);
    });

    majorResult.appendChild(wrapper);
  });

  // 전체
  const w = document.createElement("div");
  w.classList.add("result-card");
  const p = document.createElement("p");
  p.classList.add("sub-item","overall");
  const ov = data.overall;
  if (ov.overallStatus==="충족") {
    p.innerHTML = `전체: <span>${ov.totalEarned}/${ov.totalRequired}</span> <span class="status-ok">졸업 요건 만족</span>`;
  } else {
    p.innerHTML = `전체: <span>${ov.totalEarned}/${ov.totalRequired}</span> <span class="status-fail">미충족 (부족 ${ov.totalRequired-ov.totalEarned}학점)</span>`;
  }
  w.appendChild(p);
  overallResult.appendChild(w);

  overallResult.scrollIntoView({ behavior: "smooth" });
}

// 6) 클릭 핸들러
calculateBtn.addEventListener("click", async ()=>{
  const year       = yearSelect.value;
  const major      = majorSelect.value;
  const rawText    = courseTextarea.value.trim();
  if (!rawText) {
    alert("이수 과목 목록을 입력해주세요.");
    return;
  }

  const req = await loadRequirements(year);
  if (!req) return;

  calculateBtn.disabled = true;
  calculateBtn.textContent = "계산 중...";

  try {
    const result = await calculateRequirements(rawText, req, major);
    renderResult(result, req.genEd.categories);
  } catch (err) {
    console.error(err);
    alert("계산 중 오류가 발생했습니다.");
  } finally {
    calculateBtn.disabled = false;
    calculateBtn.textContent = "졸업 요건 계산하기";
  }
});
