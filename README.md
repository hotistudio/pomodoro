# 전통 뽀모도로 타이머 (Korean Traditional Pomodoro Timer)

한국 전통 디자인을 모티브로 한 PWA 뽀모도로 타이머입니다. 픽셀아트 스타일의 원형 프레임, 매듭 장식, 족두리를 활용해 집중 시간과 휴식 시간을 관리합니다.

## 주요 기능

- ⏰ **뽀모도로 타이머** — 집중/짧은 휴식/긴 휴식 자동 전환 (4회 집중 후 긴 휴식)
- 🎨 **다크모드 토글** — 상단 **족두리**를 눌러 라이트/다크 테마 전환
- 🔔 **한국 전통 종소리** — 사찰 종, 목탁, 싱잉볼, 풍경, 전자음 중 선택
- 📊 **주간 집중 기록** — 최근 7일의 뽀모도로 완료 횟수 차트
- ⚙️ **시간 프리셋** — 클래식(25/5/15), 딥 워크(50/10/30), 울트라디안(90/20/30) 등
- 📱 **PWA 지원** — 홈화면에 설치 가능, 오프라인 작동
- 💾 **자동 저장** — 테마, 설정, 집중 기록이 보존됨

## 조작법

| 버튼 | 동작 |
|------|------|
| ▶ 재생 | 타이머 시작 |
| ⏸ 일시정지 | 타이머 멈춤 |
| ↻ 리셋 | 현재 세션 초기화 |
| 🏠 홈 | 시간 프리셋 선택 |
| ⚙️ 설정 | 시간/종소리 커스터마이징 |
| 📊 통계 | 집중 기록 확인 |
| 👑 족두리 | 다크모드 전환 |

## 파일 구조

```
.
├── index.html                    # 메인 HTML
├── sw.js                         # Service Worker (오프라인 캐싱)
├── manifest.json                 # PWA 매니페스트
├── bg-light.png                  # 라이트모드 배경
├── bg-dark.png                   # 다크모드 배경
├── KoPubWorld_Batang_Bold.ttf    # 한글 폰트
├── icon-192.png                  # PWA 아이콘 (192)
├── icon-512.png                  # PWA 아이콘 (512)
├── apple-touch-icon.png          # iOS 홈화면 아이콘
├── favicon.png                   # 브라우저 탭 파비콘
└── README.md
```

## 로컬에서 실행하기

PWA는 HTTPS 또는 localhost에서만 작동합니다. 로컬 서버를 띄우세요:

```bash
# 저장소 클론
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# Python 로컬 서버
python3 -m http.server 8000
# → http://localhost:8000 접속
```

> `file://`로 직접 열면 Service Worker와 폰트가 로드되지 않습니다.

## GitHub Pages 배포 (추천)

1. GitHub 저장소의 **Settings → Pages** 이동
2. Source를 `main` 브랜치 / 루트(`/`) 로 설정 → Save
3. 1~2분 뒤 `https://<your-username>.github.io/<repo-name>/` 에서 접속

## 앱 설치

**모바일 (Android / iOS)**
- 배포된 페이지를 Chrome/Safari로 열기
- Android: "홈 화면에 추가" 메뉴
- iOS: 공유 버튼 → "홈 화면에 추가"

**데스크탑 (Chrome / Edge)**
- 주소창 오른쪽의 설치 아이콘(⊕) 클릭
- 또는 메뉴 → "앱 설치"

설치 후에는 인터넷 없이도 작동합니다.

## 사용 기술

- 순수 HTML / CSS / JavaScript (프레임워크 없음)
- Service Worker + Cache API — 오프라인 지원
- Web App Manifest — 설치 가능 앱
- Web Audio API — 종소리 실시간 합성
- Canvas API — 주간 차트 렌더링
- CSS Variables + Container Queries — 반응형 테마

## 라이선스

- 코드: MIT (자유 사용)
- 폰트: [KoPub World 바탕체](https://www.kopus.org/biz/electronic/font.aspx) — 무료 배포 (상업적 이용 가능)
