# 전통 뽀모도로 타이머 (Korean Traditional Pomodoro Timer)

한국 전통 디자인을 모티브로 한 뽀모도로 타이머입니다. 픽셀아트 스타일의 원형 프레임, 매듭 장식, 족두리를 활용해 집중 시간과 휴식 시간을 관리합니다.

## 주요 기능

- ⏰ **뽀모도로 타이머** — 집중/짧은 휴식/긴 휴식 자동 전환 (4회 집중 후 긴 휴식)
- 🎨 **다크모드 토글** — 상단 **족두리**를 눌러 라이트/다크 테마 전환
- 🔔 **한국 전통 종소리** — 사찰 종, 목탁, 싱잉볼, 풍경, 전자음 중 선택
- 📊 **주간 집중 기록** — 최근 7일의 뽀모도로 완료 횟수 차트
- ⚙️ **시간 프리셋** — 클래식(25/5/15), 딥 워크(50/10/30), 울트라디안(90/20/30) 등
- 💾 **자동 저장** — 테마, 설정, 집중 기록이 브라우저에 보존됨

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
├── index.html                    # 메인 HTML 파일
├── bg-light.png                  # 라이트모드 배경 이미지
├── bg-dark.png                   # 다크모드 배경 이미지
├── KoPubWorld_Batang_Bold.ttf    # 한글 폰트 (KoPub World 바탕 Bold)
└── README.md
```

## 로컬에서 실행하기

```bash
# 저장소 클론
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# 브라우저로 index.html 열기 (또는 간단한 로컬 서버 실행)
python3 -m http.server 8000
# → http://localhost:8000 접속
```

> **참고**: 폰트가 로컬 파일이라 `file://`로 열면 브라우저 보안 정책상 폰트가 로드되지 않을 수 있습니다. 로컬 서버(위 명령)나 GitHub Pages로 실행하세요.

## GitHub Pages로 배포

1. GitHub에서 이 저장소의 **Settings → Pages** 이동
2. Source를 `main` 브랜치, 루트(`/`) 폴더로 설정
3. 몇 분 뒤 `https://<your-username>.github.io/<repo-name>/`에서 접속 가능

## 사용 기술

- 순수 HTML / CSS / JavaScript (프레임워크 없음)
- Web Audio API — 종소리 실시간 합성
- Canvas API — 주간 차트 렌더링
- CSS Variables + Container Queries — 반응형 테마 전환

## 라이선스

- 코드: 자유롭게 사용 가능
- 폰트: [KoPub World 바탕체](https://www.kopus.org/biz/electronic/font.aspx) — 무료 배포 (상업적 이용 가능)
- 배경 이미지: 직접 만든 이미지를 사용해 주세요
