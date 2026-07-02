# vibecoding workshop — 슬라이드 프로젝트 규칙

이 파일은 `template/` 폴더 기준의 프로젝트 규칙입니다. Claude Code(또는 다른 AI 에이전트)가 슬라이드를 수정할 때 이 규칙을 자동으로 읽습니다.

## 폴더 구조

```
vibecoding-workshop/
├── template/               ← 공통 자원 (여기)
│   ├── foundation.css      디자인 토큰 + viewport lock + reset
│   ├── navigator.js        스크롤 스냅 · 해시 라우팅 · localStorage
│   ├── index.html          새 week 시작 시 복사할 뼈대
│   └── CLAUDE.md           본 규칙 파일
├── week1/
│   ├── index.html          ../template/foundation.css 참조
│   ├── styles.css          week1 특화 컴포넌트/커스텀만
│   └── assets/
├── week2/
├── week3/
└── ...
```

## 스타일 원칙

- **밝은 모드 기본** — `--bg` 크림 화이트 + `--ink` 잉크 그레이 + `--accent` 옥스퍼드 블루
- **글자 크기는 `clamp()` 로 viewport 반응형** — 발표장 해상도 편차 대응
- **한글 폰트 = Pretendard**, 모노스페이스 = JetBrains Mono
- **디자인 토큰만 template 에 두고**, 슬라이드별 커스텀 스타일은 각 week/styles.css 에

## 한국어 본문 톤

- **~합니다 / ~됩니다 / ~입니다** 격식 종결
- **명사 끊기 금지** — "시작 전 폴더 통째로 복사. 실수해도 되돌릴 수 있게." (X)
- **도치 금지** — "큰 작업은 먼저 계획만 보여주는 모드로 확인." (X)
- 연결된 자연스러운 문장으로 — "시작 전에 폴더를 복사해두어 만일의 상황에 대비합니다." (O)
- **예외**: 리스트 항목의 짧은 명사구, 프롬프트 박스의 발화체 (`> 폴더 정리해줘`), 도구 한 줄 설명은 명사구가 자연스러움

## 슬라이드 마크업 규칙

- 각 슬라이드는 `<section class="slide" data-cat="...">` 로 감쌈
- `data-cat` = 카테고리/식별자 (예: `claude-code/intro`, `example/folder-cleanup/analyze`)
- 하단 페이지 표시: `<div class="footer-mark"><span class="index">01</span><span class="sep">/</span><span>N</span></div>`
- 새 슬라이드 추가 후 페이지 번호 재번호 필요 (전체 슬라이드 개수도)

## 컴포넌트 관례

- **프롬프트 박스**: `background: var(--accent-soft); border-left: 3px solid var(--accent);` + `> 프롬프트 내용`
- **터미널 박스**: `background: var(--dark-bg); color: var(--dark-text);` + monospace
- **카드 그리드**: `border-top: 3px solid var(--accent);` + mono 라벨 + h3 제목 + 설명
- **워크플로우 스텝**: flexbox 배치, `→` 화살표로 연결

## 새 week 시작 시

1. `cp -r template week3` 로 시작
2. `week3/index.html` 의 title, 슬라이드 마크업 편집
3. `week3/styles.css` (새로 만들기) 에 week3 특화 스타일
4. `../template/foundation.css` 는 그대로 참조

## 배포

- GitHub Pages 자동 배포 (main 브랜치)
- 커밋 메시지: 영문 짧은 명령형 (예: `Add week 3 automation examples`)
