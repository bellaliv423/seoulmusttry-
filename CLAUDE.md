# Seoul in a Bite - CLAUDE.md

**프로젝트**: Seoul in a Bite - 외국인을 위한 서울 맛집 플랫폼
**마지막 업데이트**: 2026-02-09 (KST)
**패키지 매니저**: pnpm (npm/yarn 사용 금지)
**프로젝트 루트**: `D:\AI _coding_project_all\seoulmusttry\seoulmusttry_manus`
**Flutter 프로젝트**: `D:\AI _coding_project_all\seoulmusttry\seoul_in_a_bite_flutter`
**GitHub**: https://github.com/bellaliv423/seoulmusttry-.git

---

## 🔄 AI 협업 프로세스 & 자동화

### 세션 시작 체크리스트
1. [ ] CLAUDE.md 읽어서 컨텍스트 파악
2. [ ] Git status 확인 (clean인지, 어떤 브랜치인지)
3. [ ] 오늘 할 일 TODO 리스트 작성/업데이트
4. [ ] 사용자와 우선순위 논의

### 세션 종료 체크리스트
1. [ ] CLAUDE.md 업데이트 (작업 내역, 결과, 다음 TODO)
2. [ ] 사용자 확인 후 Git 커밋 (변경사항 있을 경우)
3. [ ] 다음 세션 인수인계 노트 작성

### 커밋 규칙
- **반드시 사용자 승인 후** 커밋
- **커밋 전 저장소 확인**: `git remote -v`로 올바른 저장소인지 재확인
- **잘못된 저장소 커밋 방지**: 현재 경로가 `seoulmusttry_manus`인지 확인
- 커밋 메시지 형식: `type: 간단한 설명`
  - feat: 새 기능
  - fix: 버그 수정
  - docs: 문서 업데이트
  - refactor: 코드 개선
  - style: UI/스타일 변경

---

## 오늘 작업 계획 (2026-02-09)

### 🎯 세션 목표
- AI 협업 프로세스 정립 및 CLAUDE.md 자동화 세팅
- Flutter 앱 테스트 및 실행 확인
- 오늘 작업 커밋 (사용자 승인 후)

### 📋 TODO 리스트

#### HIGH - 오늘 반드시 할 것
- [x] CLAUDE.md 업데이트 (AI 협업 프로세스 추가)
- [x] 프로젝트 현황 리뷰
- [x] Flutter 앱 환경 확인 (`flutter doctor`) - ✅ 대부분 OK
- [x] Flutter 코드 deprecation 수정 - ✅ 완료 (No issues found!)
- [x] 사용자 승인 후 커밋

#### MEDIUM - 시간 되면
- [ ] Flutter API 연동 시작 (dio + Riverpod)
- [ ] 웹앱 나머지 화면 리디자인 계획

#### LOW - 다음 세션으로
- [ ] Supabase OAuth 설정
- [ ] Play Store 배포 준비
- [ ] Flutter 빌드 경로 문제 해결 (D:\Program Files 공백 이슈)

### 오늘 완료된 작업 (2026-02-09)

#### Flutter 프로젝트 deprecation 수정
| 파일 | 수정 내용 |
|------|----------|
| `lib/core/theme/app_theme.dart` | `CardTheme` → `CardThemeData`, `withOpacity` → `withValues(alpha:)` |
| `lib/features/home/home_screen.dart` | `withOpacity` 9곳 수정, 불필요한 캐스트 제거 |
| `lib/features/meal_buddy/meal_buddy_screen.dart` | `withOpacity` 5곳 수정 |
| `lib/features/profile/profile_screen.dart` | `withOpacity` 4곳 수정, 미사용 import 제거 |
| `lib/features/restaurant/restaurant_detail_screen.dart` | `withOpacity` 5곳 수정 |
| `lib/shared/widgets/main_scaffold.dart` | `withOpacity` 1곳 수정 |
| `test/widget_test.dart` | `MyApp` → `SeoulInABiteApp` 수정 |

#### 결과
- `flutter analyze`: ✅ **No issues found!**
- `flutter build web`: ❌ 경로 공백 문제 (Flutter 경로 "D:\Program Files" 관련)

#### 알려진 이슈
- Flutter SDK가 "D:\Program Files\flutter"에 설치되어 있어 공백 때문에 일부 빌드 명령에서 오류 발생
- 해결 방법: Flutter를 공백 없는 경로로 재설치 (예: "D:\flutter")

---

## 이전 작업 내역 (2026-02-06)

### 세션 요약
- 프로젝트 전체 리뷰 및 현황 파악 완료
- 이전 작업물 (2026-02-05) 커밋 및 GitHub 푸시 완료
- 커밋: `db99d92` - feat: Apply Google Stitch design and orange theme

### 커밋된 파일
| 파일 | 변경 내용 |
|------|----------|
| CLAUDE.md | Phase 4 진행 상황 업데이트 |
| client/index.html | Analytics 스크립트 제거 |
| client/src/index.css | 오렌지 컬러 테마 (#FF6B35) 적용 |
| client/src/main.tsx | Kakao Maps 동적 로드 추가 |
| client/src/pages/Home.tsx | Google Stitch 디자인 기반 전면 리디자인 |
| package.json | cross-env 패키지 추가 |
| pnpm-lock.yaml | 의존성 업데이트 |

---

## 이전 TODO (2026-02-06 기준)

### HIGH - 반드시 해야 할 것
- [ ] **Flutter 앱 테스트** - `flutter pub get` → `flutter run` 실행
- [ ] **Flutter API 연동** - dio + Riverpod로 웹 백엔드 연결
- [ ] **웹앱 나머지 화면 리디자인** - RestaurantDetail, MealBuddy, Profile

### MEDIUM - 시간 되면
- [ ] **Supabase OAuth 설정** - Google + Kakao 로그인
- [ ] **Supabase Storage** - 이미지 업로드용 버킷 생성
- [ ] **DB 스키마 적용** - `pnpm db:push` 실행

### LOW - 나중에
- [ ] **Vercel 배포** - 웹앱 프로덕션 배포
- [ ] **Play Store 준비** - 앱 아이콘, 스플래시 화면
- [ ] **Admin Dashboard** - 관리자 페이지 개발

---

## 이전 작업 내역 (2026-02-05)

### 완료된 작업

#### 1. Google Stitch 디자인 적용
- Google Stitch에서 UI 디자인 생성 및 다운로드
- 디자인 파일 저장: `D:\AI _coding_project_all\seoulmusttry\design\stitch\`
- 총 14개 화면 디자인 완료:
  - seoul_in_a_bite_home, restaurant_details, restaurant_map_view
  - meal_buddy_community, create_meal_buddy_post, join_meal_buddy_post
  - my_meal_buddy_post_details, meal_buddy_group_chat, post_success_confirmation
  - review_your_buddy, user_profile_&_favorites, write_restaurant_review

#### 2. 웹앱 디자인 시스템 업데이트
- **컬러 테마 변경**: 파란색 → 오렌지+화이트
  - Primary: Sunset Orange (#FF6B35)
  - Secondary: Tangerine (#FF8C42)
  - Background: Pure White (#FFFFFF), Cream White (#FFF8F0)
- **폰트 추가**: Poppins (제목), Inter (본문), Noto Sans (다국어)
- **index.css** 업데이트: oklch 컬러 시스템으로 라이트/다크 모드 지원

#### 3. 웹앱 환경변수 문제 해결
- `VITE_KAKAO_MAP_API_KEY` 추가 (.env)
- `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID` 추가
- `index.html`에서 Analytics 스크립트 제거 (선택적 기능)
- Kakao Maps API를 `main.tsx`에서 동적 로드하도록 변경
- `cross-env` 패키지 추가 (Windows NODE_ENV 호환)

#### 4. 웹앱 홈 화면 UI 리디자인
- Google Stitch 디자인 기반으로 `Home.tsx` 전면 업데이트
- 가로 스크롤 카테고리 칩
- Featured 배너 섹션 추가
- 2열 맛집 그리드 (정사각형 이미지 + 하트 버튼)
- 가격 필터 ($, $$, $$$)

#### 5. Flutter 앱 프로젝트 생성 (신규)
- **프로젝트 위치**: `D:\AI _coding_project_all\seoulmusttry\seoul_in_a_bite_flutter`
- **패키지 설정** (pubspec.yaml):
  - flutter_riverpod (상태 관리)
  - go_router (라우팅)
  - dio (HTTP)
  - cached_network_image, google_fonts, shimmer
  - google_maps_flutter, geolocator
- **디자인 시스템**:
  - `lib/core/theme/app_colors.dart` - 오렌지 컬러 팔레트
  - `lib/core/theme/app_theme.dart` - Material 3 테마
- **라우터**: `lib/core/router/app_router.dart` (GoRouter + ShellRoute)
- **화면 구현**:
  - `home_screen.dart` - 홈 화면 (검색, 카테고리, 배너, 맛집 그리드)
  - `restaurant_detail_screen.dart` - 맛집 상세 (메뉴, 리뷰 탭)
  - `meal_buddy_screen.dart` - 밥친구 목록
  - `profile_screen.dart` - 프로필 (통계, 저장 목록)
  - `main_scaffold.dart` - 하단 네비게이션 바

#### 6. 종합 기획안 작성
- **파일**: `D:\AI _coding_project_all\seoulmusttry\Seoul_in_a_Bite_종합_기획안.md`
- 브랜드 아이덴티티, 컬러 팔레트, 기술 스택
- Google Stitch 디자인 요청 프롬프트 (한국어/영어)
- 웹 + Flutter 앱 배포 로드맵

### 웹앱 실행 방법 (Windows)

```bash
cd "D:\AI _coding_project_all\seoulmusttry\seoulmusttry_manus"
pnpm exec cross-env NODE_ENV=development pnpm exec tsx watch server/_core/index.ts
```

서버 URL: http://localhost:3000/ (또는 사용 가능한 포트)

### Flutter 앱 실행 방법

```powershell
cd "D:\AI _coding_project_all\seoulmusttry\seoul_in_a_bite_flutter"
flutter pub get
flutter run
```

### 다음 세션에서 진행할 작업

1. **Flutter 앱 테스트** - `flutter pub get` 및 `flutter run` 실행
2. **Flutter API 연동** - 웹 백엔드 API와 연결
3. **Supabase 설정** - OAuth, Storage 버킷 생성
4. **웹앱 나머지 화면 리디자인** - RestaurantDetail, MealBuddy, Profile
5. **Play Store 배포 준비** - 앱 아이콘, 스플래시 화면

---

## 이전 작업 내역 (2026-02-03)

### 완료된 작업

1. **Phase 3 작업 상태 리뷰**
   - 모든 공통 컴포넌트 적용 확인 완료
   - Home.tsx, RestaurantDetail.tsx, MealBuddyPage.tsx, MealBuddyPostDetail.tsx 모두 완료
   - LoadingSpinner, EmptyState, ErrorState, HighlightedText 적용됨

2. **검색/필터 강화 확인**
   - 가격 필터 UI 이미 구현됨 (Home.tsx)
   - 검색어 하이라이트 이미 구현됨 (HighlightedText 컴포넌트)
   - i18n 번역 키 4개 언어 모두 추가됨

3. **프로젝트 상태 정리**
   - Git: main 브랜치, clean 상태
   - GitHub: https://github.com/bellaliv423/seoulmusttry-.git

4. **GitHub 커밋 완료**
   - AI_COLLABORATION.md를 프로젝트 루트로 이동 (git 추적 가능하도록)
   - 커밋: `f3b75aa` - docs: Update Phase 3 status to complete
   - 푸시 완료: origin/main

### 결론: Phase 3 모든 작업 완료됨

---

## 이전 작업 내역 (2026-01-29)

### 완료된 작업

1. **Supabase 새 프로젝트 생성**
   - 프로젝트명: `seoulmusttry`
   - Region: Asia-Pacific
   - 이전 프로젝트가 90일 이상 일시정지되어 새로 생성
   - 모든 키/URL 구글 시트에 저장 완료

2. **GitHub 저장소 생성 및 연결**
   - 저장소: https://github.com/bellaliv423/seoulmusttry-.git
   - 프로젝트 전체 업로드 완료

### 다음 단계 (사용자 진행 필요)

1. **Supabase OAuth 설정**
   - Google OAuth 설정 (Google Cloud Console 필요)
   - Kakao OAuth 설정 (REST API Key: `d75cf48f0236abf66bf289ea32952bbe`)
   - Redirect URI: `https://jdifujagzwealkdyfizg.supabase.co/auth/v1/callback`

2. **Supabase Storage 설정**
   - `uploads` 버킷 생성 (public)

3. **DB 스키마 적용**
   - `pnpm db:push` 실행

4. **Seed 데이터 입력**
   - `node seed-data.mjs` 실행

---

## Supabase 프로젝트 정보 (2026-01-29 생성)

| 항목 | 값 |
|------|-----|
| Project Name | seoulmusttry |
| Project URL | https://jdifujagzwealkdyfizg.supabase.co |
| Region | Asia-Pacific |
| Anon Key | sb_publishable_bvaakyG_xkbHVVS5UBxOPA_uCEMOUy9 |
| Service Role Key | (구글 시트에 저장됨 - 비공개) |
| Database URL | (구글 시트에 저장됨 - 비공개) |

---

## 이전 작업 내역 (2026-01-28)

### 완료된 작업

1. **API 통합 데이터 수집 스크립트 완전 재작성**
   - 파일: `collect-restaurant-data.mjs`
   - 내용: 한국문화정보원 API + SerpAPI (Google Maps) 통합
   - 기존 문제: MySQL 드라이버, 잘못된 필드명, axios 미설치, SerpAPI 미활용
   - 해결: PostgreSQL(`postgres` 패키지), Node.js 내장 `fetch`, 올바른 스키마 필드명
   - 기능: 3단계 수집 (KCISA→SerpAPI 보강→DB 저장), 중복 검사, rate limiting, CLI 옵션
   - CLI: `--dry-run`, `--category`, `--limit`, `--skip-serp`, `--serp-budget`, `--update`, `--verbose`

2. **환경변수 업데이트**
   - 파일: `.env.example`
   - 추가: `KCISA_API_KEY`, `SERPAPI_KEY`

3. **AI 협업 문서 업데이트**
   - 파일: `AI_COLLABORATION.md`
   - seed-data.mjs 상태 DONE 확인 (이미 PostgreSQL 변환 완료)
   - 엔티 작업 #4 (공통 컴포넌트 적용) 신규 추가
   - Phase 3 진행 현황표 + Decision Log 업데이트

4. **seed-data.mjs 상태 확인**
   - 이미 PostgreSQL로 변환 완료 (`postgres` 패키지 사용)
   - 56개+ 레스토랑, 8개 카테고리, 다국어 데이터 포함
   - 엔티 작업 #1 → DONE 처리

### 이전 이슈 (2026-01-27)

1. **npm 깨짐 이슈** (미해결)
   - `npm install` 시 `Cannot find module 'npm-prefix.js'` 에러
   - Node.js v22.17.0이지만 npm 손상
   - **해결 필요**: Node.js 재설치 또는 pnpm 독립 설치

---

## 다음 작업

### Phase 3 완료됨 (2026-02-03 확인)

- 공통 컴포넌트 적용: DONE
- 검색/필터 강화: DONE

### Phase 4 (TODO)

1. **Admin Dashboard** - 관리자 페이지
2. **리뷰 사진 업로드** - Supabase Storage 활용
3. **실시간 알림** - Meal Buddy 매칭 알림
4. **성능 최적화** - 이미지 최적화, 코드 스플리팅
5. **E2E 테스트** - Playwright 또는 Cypress

### 사용자 진행 필요 (배포 준비)

1. Supabase OAuth 설정 (Google + Kakao)
2. Supabase Storage 버킷 생성
3. DB 스키마 적용 (`pnpm db:push`)
4. Seed 데이터 입력 (`node seed-data.mjs`)
5. Vercel 배포

---

## 핵심 규칙 (모든 AI 에이전트 필독)

- **패키지 매니저**: pnpm 사용 (npm/yarn 아님)
- **i18n**: FLAT 키만 사용 - `t("mealBuddy")` O / `t("mealBuddy.title")` X
- **i18n 언어**: ko, en, zh-TW, zh-CN 4개 모두 업데이트
- **DB**: PostgreSQL (Supabase), MySQL 아님
- **Rating**: integer * 10 (45 = 4.5점)
- **검색**: PostgreSQL `ilike` 사용
- **인증**: Supabase Auth (Google + Kakao + Email)
- **Navbar**: App.tsx에 공유 - 페이지별 헤더 추가 금지
- **색상 테마**: 오렌지/앰버 톤
- **컴포넌트**: shadcn/ui + lucide-react 아이콘
- **라우팅**: Wouter (React Router 아님)
- **데이터 수집**: `collect-restaurant-data.mjs` (KCISA + SerpAPI, CLI 옵션 지원)
- **Seed 데이터**: `seed-data.mjs` (PostgreSQL, 56개+ 레스토랑)

---

## 프로젝트 진행 현황

| Phase | 설명 | 상태 |
|-------|------|------|
| Phase 1 | Full-stack 기반 (Manus AI) | DONE |
| Phase 2 | 마이그레이션 + Meal Buddy (Claude Code) | DONE |
| Phase 3 | 개선 작업 (Claude Code) | DONE |
| Phase 4 | UI 리디자인 + Flutter 앱 (Claude Code) | IN PROGRESS |

### Phase 4 상세 (2026-02-05 시작)

| # | 작업 | 담당 | 상태 |
|---|------|------|------|
| 1 | Google Stitch 디자인 생성 | 사용자 | DONE |
| 2 | 웹앱 디자인 시스템 (컬러/폰트) | Claude Code | DONE |
| 3 | 웹앱 환경변수 문제 해결 | Claude Code | DONE |
| 4 | 웹앱 홈 화면 리디자인 | Claude Code | DONE |
| 5 | Flutter 프로젝트 생성 | Claude Code | DONE |
| 6 | Flutter 디자인 시스템 | Claude Code | DONE |
| 7 | Flutter 주요 화면 개발 | Claude Code | DONE |
| 8 | Flutter 앱 테스트 및 실행 | 사용자 | TODO |
| 9 | Flutter API 연동 | Claude Code | TODO |
| 10 | 웹앱 나머지 화면 리디자인 | Claude Code | TODO |

### Phase 3 상세

| # | 작업 | 담당 | 상태 |
|---|------|------|------|
| 1 | Shared Navigation (Navbar) | Claude Code | DONE |
| 2 | 폴더 정리 | Claude Code | DONE |
| 3 | Seed Script PostgreSQL 확인 | Claude Code | DONE |
| 4 | UI/UX 공통 컴포넌트 생성 | Claude Code | DONE |
| 5 | MapPage ErrorState prop 수정 | Claude Code | DONE |
| 6 | API 통합 데이터 수집 (KCISA + SerpAPI) | Claude Code | DONE |
| 7 | 기존 페이지에 공통 컴포넌트 적용 | Claude Code | DONE (2026-02-03 확인) |
| 8 | 검색/필터 강화 (가격 필터 + 하이라이트) | Claude Code | DONE (2026-02-03 확인) |
| 9 | Admin Dashboard | 미정 | TODO (Phase 4) |

---

## AI 협업 정보

- **메인 협업 문서**: `AI_COLLABORATION.md` (프로젝트 루트, 2026-02-03 이동됨)
- **협업 AI**: Manus AI (Phase 1), Claude Code (Phase 2-3)
- **Source of Truth**: `AI_COLLABORATION.md`가 전체 프로젝트 스펙/아키텍처 문서
- **이 파일(CLAUDE.md)**: 일일 작업 기록 + Claude Code 세션별 컨텍스트 용도

---

## 앱 실행 방법

### 로컬 개발 서버 실행

```bash
cd "D:\AI _coding_project_all\seoulmusttry\seoulmusttry_manus"
pnpm install
pnpm dev
```

### 환경변수 설정 필요 (.env 파일 생성)

구글 시트에 저장된 Supabase 키로 `.env` 파일 생성:

```
SUPABASE_URL=https://jdifujagzwealkdyfizg.supabase.co
VITE_SUPABASE_URL=https://jdifujagzwealkdyfizg.supabase.co
VITE_SUPABASE_ANON_KEY=(구글 시트에서 복사)
SUPABASE_SERVICE_ROLE_KEY=(구글 시트에서 복사)
DATABASE_URL=(구글 시트에서 복사)
VITE_KAKAO_MAP_JS_KEY=1c716f8fc9de5cedc4e6041882078c71
```

### 다음 세션에서 진행할 작업

1. `.env` 파일 설정 후 앱 실행 테스트
2. Supabase OAuth 설정 (Google + Kakao)
3. DB 스키마 적용 및 Seed 데이터 입력
4. Vercel 배포
