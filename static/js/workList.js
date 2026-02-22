let savedScrollY = 0;
let focusedElement = null;

// .project-link 클릭시 누른 a태그의 id 확인
function setupProjectLinks() {
    document.addEventListener('click', (e) => {
        const projectLink = e.target.closest('.project-link');
        if (!projectLink) return;
        
        e.preventDefault();
        
        const projectId = projectLink.id;
        
        if (!projectId) {
            console.warn('프로젝트 ID가 없습니다.');
            return;
        }
        
        // 클릭한 요소 저장
        focusedElement = projectLink;
        
        showProjectById(projectId);
    });
}

// ID로 프로젝트 찾아서 표시
function showProjectById(projectId) {
    const modal = document.getElementById('projectsContainer');
    const projectList = document.getElementById('projectList');
    
    if (!modal || !projectList) {
        console.error('모달 또는 프로젝트 리스트 요소를 찾을 수 없습니다.');
        return;
    }
    
    const project = findProjectById(projectId);
    
    if (project) {
        projectList.innerHTML = renderSingleProject(project);

        // 스크롤 위치 저장
        savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;

        document.body.style.position = 'fixed';
        document.body.style.top = `-${savedScrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';

        modal.style.display = 'flex';

    } else {
        console.warn(`ID "${projectId}"에 해당하는 프로젝트를 찾을 수 없습니다.`);
    }
}

// ID로 프로젝트 찾기
function findProjectById(projectId) {
    return projects.find(project => project.id === projectId) || null;
}

// 프로젝트 html 템플릿
function renderSingleProject(project) {
    return `
        <li class="project-item">
            <div class="screen">
                <div>
                    <a href="javascript:void(0);" class="b-close" title="프로젝트 상세 닫기"></a>
                    <div class="project-item__head">
                        <h3 class="name">
                            <span class="ctgr">프로젝트명</span>
                            ${project.projectName}
                        </h3>
                        <ul class="achievement">
                            ${project.achievement.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        <p class="summary">
                            <span class="ctgr">서비스 설명</span>
                            ${project.summary}
                        </p>
                        <div class="info">
                            <div class="date">${project.date}</div>
                            <div class="teamNum">${project.teamNum}</div>
                            <div class="contribution">${project.contribution}</div>
                        </div>
                        <div class="skill-tag">
                            ${project.skills.map(tag => `<span class="tag ${tag}"></span>`).join('')}
                        </div>
                        <div class="link">
                            ${project.link ? `<a href="${project.link}" class="b-togo" target="_blank">사이트 보러가기</a>` : ''}
                        </div>
                    </div>
                    <div class="project-item__body">
                        <h4 class="ctgr">상세내용</h4>
                        <div class="detail">
                            <ul class="desc">
                                ${project.desc.map(text => `<li>${text}</li>`).join('')}
                            </ul>
                             ${project.troubleShooting && project.troubleShooting.length > 0 
                                ? `<div>
                                        <h4 class="ctgr">트러블슈팅</h4>
                                        <ul class="troubleShooting">
                                            ${project.troubleShooting.map(item => `<li>${item}</li>`).join('')}
                                        </ul>
                                    </div> `
                                : ''
                            }
                            
                            ${project.imgs && project.imgs.length
                                  ? project.imgs.map((img, index) => `
                                      <img src="${img}" alt="${project.projectName} 이미지 ${index + 1}" loading="lazy">`).join('')
                                  : ''
                              }
                        </div>
                    </div>
                   
                </div>
            </div>
            <div class="base">
                <span class="tl"></span>
                <span class="tr"></span>
                <span class="bl"></span>
                <span class="br"></span>
                <span class="tbr"></span>
                <span class="bbr"></span>
                <span class="lbr"></span>
                <span class="rbr"></span>
            </div>
        </li>
    `;
}

// 모달 닫기 기능 설정
function setupModalClose() {
    
    // 닫기 버튼 클릭 이벤트
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('b-close')) {
            closeModal();
        }
    });
    
    // ESC 키 이벤트
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            const modal = document.getElementById('projectsContainer');
            if (modal && modal.style.display === 'block') {
                closeModal();
            }
        }
    });
}

// 모달 닫기 함수
function closeModal() {
    const modal = document.getElementById('projectsContainer');
    if (!modal) return;

    const scrollRestore = savedScrollY;

    // 모달 숨기기
    modal.style.display = 'none';

    // body 스타일 제거
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    document.documentElement.style.scrollBehavior = 'auto';
    
    // 스크롤 복현
    window.scrollTo(0, scrollRestore);

    // smooth scroll 다시 활성화
    requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
    });

    // 포커스 복현
    if (focusedElement) {
        focusedElement.focus();
        focusedElement = null;
    }
}


// DOMContentLoaded 이벤트 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    setupProjectLinks();
    setupModalClose();
});