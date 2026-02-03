# Seoul in a Bite - CLAUDE.md

**프로젝트**: Seoul in a Bite - 외국인을 위한 서울 맛집 플랫폼
**마지막 업데이트**: 2026-02-03 (KST)
**패키지 매니저**: pnpm (npm/yarn 사용 금지)
**프로젝트 루트**: `D:\AI _coding_project_all\seoulmusttry\seoulmusttry_manus`
**GitHub**: https://github.com/bellaliv423/seoulmusttry-.git

---

## 오늘 작업 내역 (2026-02-03)

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
