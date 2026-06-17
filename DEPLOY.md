# EL PLAZA · 세부 한 달 살기 — Vercel 배포 가이드

이 폴더(`deploy/`)는 **정적 사이트**입니다. 빌드 과정 없이 그대로 올리면 됩니다.

## 폴더 구성
```
index.html              ← 메인 페이지 (루트에서 바로 열림)
tweaks-panel.jsx        ← Tweaks 패널 컴포넌트
assets/
  styles.css            ← 디자인 시스템
  tweaks-themes.css     ← 테마(서체·모서리) 변형
  app.js                ← 캘린더·스크롤·탭 인터랙션
  tweaks-app.jsx        ← Tweaks 컨트롤 (컬러/서체/모서리)
images/                 ← 실제 사진 (히어로·엘프라자 외관·클래스 4컷)
```

---

## 방법 A — 드래그&드롭 (가장 쉬움, 계정만 있으면 1분)
1. https://vercel.com/new 접속 후 로그인
2. **"Deploy"** 화면에서 이 `deploy` 폴더를 통째로 드래그&드롭
   (또는 ZIP 업로드)
3. **Project Name** 에 `elplaza` 입력 → Deploy
4. 완료되면 `https://elplaza.vercel.app` 형태로 게시됩니다.

## 방법 B — Vercel CLI
```bash
npm i -g vercel
cd deploy
vercel --prod        # 프로젝트명 물어보면 elplaza 입력
```

## 방법 C — GitHub 연동 (자동 재배포)
1. 이 폴더를 GitHub 저장소에 올림 (저장소 루트 = 이 폴더 내용)
2. Vercel → New Project → 해당 저장소 Import
3. Framework Preset: **Other** (빌드 명령 없음) → Deploy

---

## 커스텀 도메인 연결 (선택)
Vercel 프로젝트 → **Settings → Domains** 에서
`elplaza.com` 등 보유 도메인을 추가하고 안내된 DNS 레코드를 등록하면 됩니다.

## 참고
- 폰트·React·Babel은 CDN에서 로드되므로 인터넷 연결이 필요합니다.
- 투어 섹션(보홀·오슬롭·골프·호핑·시티)은 실제 사진 자리표시자 상태입니다.
  사진을 받으면 `images/` 에 추가하고 `index.html`의 해당 `.ph` 자리에 넣으면 됩니다.
