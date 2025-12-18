const demons = [
  {
    name: "niwa",
    creators: "KrazyGFX, Mrgm, peng, Blaze, Teno, Pedro, Aranda, BeClan, Titoalper, Asuith, Genoxide",
    verifier: "Teno(Original), Nicor77(Update)",
    publisher: "Teno",
    video: "https://www.youtube.com/embed/1tven_pFftA",
    id: "87425029",
    password: "비밀번호 없음",
    tag: "Long, NONG, 러닝, 클릭 싱크, 템포가 빠른 맵"
  },
  {
    name: "Mizureta",
    creators: "Graded, peng, Tom163, Xenith, D3lteX, humbjumb, Daydream, Horizontal1, TriplasH, zoxical, Samzaya, Kacurroo, Zentraa, Vendas, Pedro, IcyConey, dutchiee",
    verifier: "Airbound(Original), dutchiee(Update), ThisIsGDNick(Update), Shyne(Update)",
    publisher: "dutchiee",
    video: "https://www.youtube.com/embed/w842SzEdLK8",
    id: "95764848",
    password: "비밀번호 없음",
    tag: "Long, NONG, 러닝, 클릭 싱크, 템포가 빠른 맵"
  },
  {
    name: "Acu",
    creators: "neigefeu",
    verifier: "neigefeu",
    publisher: "neigefeu",
    video: "https://www.youtube.com/embed/z6l74Mkoxm8",
    id: "61079355",
    password: "비밀번호 없음",
    tag: "Long, 러닝, 클릭 싱크, 타이밍"
  }
  ];

/* ===========================
   changeLog 데이터 (요청한 예시 2개 포함)
   - 'detail' 필드에 단순 텍스트(글)만 들어갑니다.
   - 날짜는 문자열(YYYY-MM-DD 또는 로컬 포맷)로 표기.
   =========================== */
const changeLog = [
  { date: '2025-12-18', detail: 'Acu이/가 Mizureta 아래인 3위에 등재되었습니다.' },
  { date: '2025-12-18', detail: 'Mizureta이/가 niwa 아래인 2위에 등재되었습니다.' },
  { date: '2025-12-18', detail: 'niwa이/가 1위에 등재되었습니다.' },
  { date: '2025-12-18', detail: 'List Created' }
  ];
/* ===========================
    DOM references (전역 변수로 선언)
    =========================== */
let mapList;
let mapDetailsDiv;
let changeLogDiv;

let btnList;
let btnChangelog;

let mapName;
let mapCreators;
let mapVerifier;
let mapPublisher;
let mapVideo;
let mapId;
let mapPassword;
let mapTag;

// 💡 검색창 요소 ID: index.html의 'search-input'과 일치하도록 수정되었습니다.
let searchInput; 

function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function(m) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
    });
}

// ===========================
// 좌측 리스트 생성 (검색 기능, 절대 순위, 자동 선택 기능 포함)
// ===========================
function buildLeftList() {
    if (!mapList) return;

    mapList.innerHTML = '';
    
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const filteredDemons = keyword
        ? demons.filter(d => d.name.toLowerCase().includes(keyword))
        : demons;

    let firstLiElement = null; // 첫 번째 생성된 li 요소를 저장할 변수
    let firstDemonData = null; // 첫 번째 생성된 맵의 데이터를 저장할 변수

    filteredDemons.forEach((d, index) => {
        // ⭐️ 원본 순위 계산: demons 배열에서 원래 위치를 찾아 순위를 계산합니다.
        const originalIndex = demons.findIndex(item => item.name === d.name); 
        const rank = originalIndex !== -1 ? originalIndex + 1 : index + 1;

        let separator = null;
        if (!keyword) { 
            // ⭐️ 구분 라벨 표시: 원래 순위(rank)를 기준으로 구분선을 표시합니다.
            if (rank === 1) separator = "Main List (#1 ~ #75)";
            else if (rank === 76) separator = "Extended List (#76 ~ #150)";
            else if (rank === 151) separator = "Legacy List (#151 ~)";
        }

        if (separator) {
            const sepLi = document.createElement('li');
            sepLi.textContent = separator;
            sepLi.classList.add('separator');
            mapList.appendChild(sepLi);
        }

        const li = document.createElement('li');
        
        const rankSpan = document.createElement('span');
        rankSpan.textContent = `#${rank} `;
        rankSpan.style.fontWeight = 'bold';
        rankSpan.style.marginRight = '6px';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = d.name;
        nameSpan.classList.add('name');
        nameSpan.addEventListener('click', () => selectMap(d, li));

        li.appendChild(rankSpan);
        li.appendChild(nameSpan);
        mapList.appendChild(li);

        // ⭐️ 자동 선택 로직: 리스트를 새로 만들 때 첫 번째 맵을 저장합니다.
        if (!firstLiElement) {
            firstLiElement = li;
            firstDemonData = d;
        }
    });
    
    // ⭐️ 리스트 생성 완료 후, 첫 번째 항목을 자동으로 선택합니다.
    if (firstDemonData && firstLiElement) {
        selectMap(firstDemonData, firstLiElement);
    } else {
        // 검색 결과가 없을 때 상세 정보를 숨깁니다.
        if (mapDetailsDiv) mapDetailsDiv.style.display = 'none';
    }
}

// ===========================
// map 상세 표시 (기존 selectMap 함수 그대로 유지)
// ===========================
function selectMap(demon, liElement) {
    // ⭐️ 상세 패널을 표시하고 Change Log를 숨깁니다.
    if (mapDetailsDiv) mapDetailsDiv.style.display = '';
    if (changeLogDiv) changeLogDiv.style.display = 'none';

    mapName.textContent = demon.name;
    mapCreators.innerHTML = `<span class="tag">CREATORS</span><span class="value">${escapeHtml(demon.creators)}</span>`;
    mapVerifier.innerHTML = `<span class="tag">VERIFIER</span><span class="value">${escapeHtml(demon.verifier)}</span>`;
    mapPublisher.innerHTML = `<span class="tag">PUBLISHER</span><span class="value">${escapeHtml(demon.publisher)}</span>`;
    mapVideo.innerHTML = `<iframe src="${escapeHtml(demon.video)}" allowfullscreen></iframe>`;
    mapId.innerHTML = `<span class="tag">ID</span><span class="value">${escapeHtml(demon.id)}</span>`;
    mapPassword.innerHTML = `<span class="tag">PASSWORD</span><span class="value">${escapeHtml(demon.password)}</span>`;
    mapTag.innerHTML = `<span class="tag">TAGS</span><span class="value">${escapeHtml(demon.tag)}</span>`;


    document.querySelectorAll('#map-list li').forEach(el => el.classList.remove('active'));
    if (liElement) liElement.classList.add('active');

    btnList.classList.add('active');
    btnChangelog.classList.remove('active');
    btnList.setAttribute('aria-pressed', 'true');
    btnChangelog.setAttribute('aria-pressed', 'false');
}

// ===========================
// changeLog 표시 (기존 renderChangeLog 함수 그대로 유지)
// ===========================
function renderChangeLog() {
    if (!changeLogDiv) return;

    changeLogDiv.innerHTML = '';

    changeLog.forEach((entry) => {
        const row = document.createElement('div');
        row.className = 'change-log-entry';

        const d = document.createElement('div');
        d.className = 'log-date';
        d.textContent = entry.date;

        const detail = document.createElement('div');
        detail.className = 'log-detail';
        detail.textContent = entry.detail;

        row.appendChild(d);
        row.appendChild(detail);
        changeLogDiv.appendChild(row);
    });

    // ⭐️ Change Log를 표시하고 상세 패널을 숨깁니다.
    changeLogDiv.style.display = 'block';
    if (mapDetailsDiv) mapDetailsDiv.style.display = 'none';

    btnChangelog.classList.add('active');
    btnList.classList.remove('active');
    btnChangelog.setAttribute('aria-pressed', 'true');
    btnList.setAttribute('aria-pressed', 'false');
}


// ===========================
// 초기 부트 (최종 정리)
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // 1. 전역 변수에 HTML 요소 할당 (const/let 제거)
    mapList = document.getElementById('map-list');
    mapDetailsDiv = document.getElementById('map-details');
    changeLogDiv = document.getElementById('change-log');

    btnList = document.getElementById('btn-list');
    btnChangelog = document.getElementById('btn-changelog');
    
    mapName = document.getElementById('map-name');
    mapCreators = document.getElementById('map-creators');
    mapVerifier = document.getElementById('map-verifier');
    mapPublisher = document.getElementById('map-publisher');
    mapVideo = document.getElementById('map-video');
    mapId = document.getElementById('map-id');
    mapPassword = document.getElementById('map-password');
    mapTag = document.getElementById('map-tag');
    
    // ⭐️ HTML ID와 일치하도록 수정
    searchInput = document.getElementById('search-input'); 

    if (!mapList) {
        console.error("Error: 'map-list' ID를 가진 HTML 요소를 찾을 수 없습니다. index.html을 확인해주세요.");
        return; 
    }
    
    // 2. 버튼 이벤트 리스너 재정의
    if (btnList) {
        btnList.addEventListener('click', () => {
            // 버튼 활성화 클래스 설정
            btnList.classList.add('active');
            btnChangelog.classList.remove('active');
            btnList.setAttribute('aria-pressed', 'true');
            btnChangelog.setAttribute('aria-pressed', 'false');

            // 리스트를 재생성하고 첫 번째 항목을 자동으로 선택/표시합니다.
            buildLeftList(); 
        });
    }

    if (btnChangelog) {
        btnChangelog.addEventListener('click', () => renderChangeLog());
    }

    // 3. 초기 맵 리스트 생성 및 첫 번째 항목 자동 선택
    buildLeftList();

    // 4. 검색창 입력 이벤트 리스너 추가
    if (searchInput) {
        searchInput.addEventListener('input', () => buildLeftList());
    }
});

  
