# Seoul in a Bite - AI Collaboration Hub
# AI 협업 허브 (Claude Code + 엔티)

**Last Updated**: 2026-02-02 (Phase 3 진행 중 - 엔티 작업 대기)
**Project**: Seoul in a Bite - Restaurant Discovery Platform for Foreigners in Seoul
**Status**: Phase 2 Complete + Phase 3 진행 중 (Claude Code 작업 완료, 엔티 작업 대기)
**Source of Truth**: 이 파일이 유일한 프로젝트 협업 문서입니다.
**GitHub**: https://github.com/bellaliv423/seoulmusttry-.git

---

## URGENT: 엔티 작업 요청

> **엔티에게**: 아래 작업을 순서대로 진행해주세요. 각 작업의 상세 스펙, 수정 파일, 주의사항을 모두 명시했습니다. 작업 완료 후 이 문서의 해당 작업 Status를 `DONE`으로 업데이트해주세요.

### 엔티 작업 #1: Seed Script PostgreSQL 업데이트 + 데이터 확장 ~~(HIGH)~~

**Status**: DONE (2026-01-28 확인: seed-data.mjs가 이미 PostgreSQL로 변환됨. postgres 패키지 사용, 56개+ 레스토랑 데이터 포함)
**Priority**: ~~HIGH~~ COMPLETED

**참고**: `seed-data.mjs`가 이미 PostgreSQL(`postgres` 패키지)로 변환되어 있고, 56개 이상의 레스토랑 데이터가 다국어로 포함되어 있습니다. 추가 작업 불필요.

**작업 내용**:

1. `seed-data.mjs`를 PostgreSQL(postgres 드라이버)로 변환
   - `mysql2/promise` -> `postgres` 패키지 사용
   - MySQL 쿼리 문법(`?` placeholder) -> PostgreSQL 문법(`$1, $2` 또는 Drizzle ORM 사용)
   - 테이블명/컬럼명: snake_case 사용 (PostgreSQL 컨벤션)
     - `reviewCount` -> `review_count`
     - `restaurantId` -> `restaurant_id`
     - `menuItems` -> `menu_items`
   - 연결: `process.env.DATABASE_URL` (PostgreSQL connection string)

2. 레스토랑 데이터를 5개 -> 50개 이상으로 확장
   - 모든 8개 카테고리 포함: `korean`, `cafe`, `streetFood`, `bbq`, `seafood`, `dessert`, `noodles`, `chicken`
   - 카테고리당 최소 5-7개 레스토랑
   - 실제 서울 맛집 이름과 데이터 사용 (참고: `supabase/sample_data.sql`에 20개 예시 있음)
   - 모든 레스토랑에 다국어 데이터 필수:
     - `name` (한국어), `name_en`, `name_zh_tw`, `name_zh_cn`
     - `description` (한국어), `description_en`, `description_zh_tw`, `description_zh_cn`
   - GPS 좌표: 서울 범위 내 (lat: 37.4-37.7, lng: 126.8-127.1)
   - `rating`: integer * 10 (예: 45 = 4.5점)
   - `price`: `"cheap"` | `"moderate"` | `"expensive"` (enum 값)

3. 메뉴 아이템도 확장
   - 각 레스토랑당 3-5개 메뉴
   - 메뉴도 다국어: `name`, `name_en`, `name_zh_tw`, `name_zh_cn`
   - `price`: 한국 원화 (integer)

**수정 파일**: `seed-data.mjs` (1개)

**참고 파일**:
- `supabase/sample_data.sql` - 20개 레스토랑 참고 데이터 (다국어 + 좌표 포함)
- `drizzle/schema.ts` - DB 스키마 정의 (컬럼명, 타입 확인용)
- `package.json` - `postgres` 패키지가 이미 설치되어 있음

**주의사항**:
- `mysql2` import 삭제, `postgres` 사용
- 이미지 URL: Unsplash 무료 이미지 URL 사용 (`https://images.unsplash.com/photo-...?w=800`)
- category enum 값: `korean`, `cafe`, `streetFood`, `bbq`, `seafood`, `dessert`, `noodles`, `chicken` (정확히 이 값만 사용)
- price enum 값: `cheap`, `moderate`, `expensive` (정확히 이 값만 사용)

---

### 엔티 작업 #2: UI/UX 공통 컴포넌트 (HIGH)

**Status**: PARTIAL DONE (컴포넌트 생성 완료, 기존 페이지 적용은 TODO)
**Priority**: HIGH

**작업 내용**:

1. 재사용 가능한 공통 상태 컴포넌트 3개 생성:

   a. `client/src/components/LoadingSpinner.tsx`
   ```tsx
   // Props: size?: 'sm' | 'md' | 'lg', text?: string
   // 오렌지 테마 스피너 + 선택적 로딩 텍스트
   // 기존 패턴: <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
   ```

   b. `client/src/components/EmptyState.tsx`
   ```tsx
   // Props: icon?: LucideIcon, title: string, description?: string, action?: { label: string, onClick: () => void }
   // 빈 상태 표시 (예: "아직 리뷰가 없습니다", "검색 결과가 없습니다")
   ```

   c. `client/src/components/ErrorState.tsx`
   ```tsx
   // Props: title?: string, description?: string, onRetry?: () => void
   // 에러 상태 표시 + 재시도 버튼
   ```

2. 기존 페이지의 인라인 로딩/에러/빈상태를 새 컴포넌트로 교체:
   - `Home.tsx` - 로딩 스피너, 빈 검색 결과
   - `RestaurantDetail.tsx` - 로딩 스피너, 레스토랑 없음
   - `MapPage.tsx` - (필요시)
   - `MealBuddyPage.tsx` - 로딩, 빈 포스트
   - `MealBuddyPostDetail.tsx` - 로딩, 포스트 없음

**생성 파일**: 3개 (`LoadingSpinner.tsx`, `EmptyState.tsx`, `ErrorState.tsx`)
**수정 파일**: 최대 5개 (위 페이지들)

**디자인 규칙**:
- 색상: 오렌지/앰버 톤 (`text-orange-500`, `bg-orange-50`, `border-orange-100`)
- 배경: `bg-gradient-to-br from-orange-50 via-white to-amber-50` (전체 페이지일 때)
- 아이콘: `lucide-react` 사용
- shadcn/ui `Button` 사용 (재시도 버튼 등)
- i18n: 새로운 키가 필요하면 4개 언어 모두 추가 (`client/src/lib/i18n.ts`)
- i18n 키는 FLAT만 사용: `t("errorOccurred")` (O) / `t("error.occurred")` (X)

---

### 엔티 작업 #4: 기존 페이지에 공통 컴포넌트 적용 (HIGH)

**Status**: TODO
**Priority**: HIGH (작업 #3보다 먼저)

**배경**: Phase 3에서 Claude Code가 생성한 공통 컴포넌트 3개(`LoadingSpinner`, `EmptyState`, `ErrorState`)를 기존 페이지의 인라인 로딩/에러/빈 상태 코드에 적용해야 합니다.

**작업 내용**:

1. `client/src/pages/Home.tsx`
   - 로딩 중 인라인 스피너 → `<LoadingSpinner />` 교체
   - 검색 결과 없음 → `<EmptyState title={t("noResults")} />` 교체

2. `client/src/pages/RestaurantDetail.tsx`
   - 로딩 중 인라인 코드 → `<LoadingSpinner size="lg" />` 교체
   - 레스토랑 없음 → `<ErrorState title={t("restaurantNotFound")} />` 교체

3. `client/src/pages/MealBuddyPage.tsx`
   - 로딩 중 → `<LoadingSpinner />` 교체
   - 포스트 없음 → `<EmptyState />` 교체

4. `client/src/pages/MealBuddyPostDetail.tsx`
   - 로딩 중 → `<LoadingSpinner />` 교체
   - 포스트 없음 → `<ErrorState />` 교체

**참고 컴포넌트 파일**:
- `client/src/components/LoadingSpinner.tsx` - Props: `size?: 'sm' | 'md' | 'lg'`, `text?: string`
- `client/src/components/EmptyState.tsx` - Props: `icon?: LucideIcon`, `title: string`, `description?: string`, `action?: { label: string, onClick: () => void }`
- `client/src/components/ErrorState.tsx` - Props: `title?: string`, `description?: string`, `onRetry?: () => void`

**수정 파일**: 최대 4개 (위 페이지들)

**주의사항**:
- import 경로: `@/components/LoadingSpinner` 형태
- 기존 인라인 스타일 완전 제거 (공통 컴포넌트로 대체)
- i18n 키가 필요하면 `client/src/lib/i18n.ts`에 4개 언어 모두 추가
- i18n 키는 FLAT만 사용: `t("noResults")` (O) / `t("search.noResults")` (X)

---

### 엔티 작업 #3: 검색/필터 강화 (MEDIUM)

**Status**: TODO
**Priority**: MEDIUM

**작업 내용**:

1. Home 페이지(`Home.tsx`)에 가격 필터 추가
   - 현재: 카테고리 필터 + 검색만 있음
   - 추가: 가격대 필터 (cheap/moderate/expensive)
   - UI: 카테고리 필터 아래에 가격 필터 버튼 3개 (또는 토글)
   - tRPC: `restaurants.byCategory`에 price 파라미터 추가하거나 새 endpoint 생성

2. 검색 결과에 하이라이트 표시
   - 검색어가 레스토랑 이름/설명에 포함된 부분 하이라이트

3. 필요한 i18n 키 추가 (4개 언어 모두):
   - `priceFilter` / `priceCheap` / `priceModerate` / `priceExpensive`
   - 기타 필요한 키

**수정 파일**:
- `client/src/pages/Home.tsx` - 가격 필터 UI
- `server/routers.ts` - 가격 필터 endpoint (필요시)
- `server/restaurantDb.ts` - 가격 필터 쿼리 (필요시)
- `client/src/lib/i18n.ts` - 새 번역 키

---

## Quick Status Summary

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Full-stack foundation (Manus AI) | DONE |
| Phase 2 | Migration + Meal Buddy (Claude Code) | DONE |
| Phase 3 | Enhancements (Claude Code + 엔티) | IN PROGRESS |

### Phase 3 진행 현황 (2026-02-02 Updated)

| # | Task | Assignee | Status | Notes |
|---|------|----------|--------|-------|
| 1 | Shared Navigation Component | Claude Code | DONE | Navbar.tsx 생성, App.tsx에 적용 |
| 2 | 폴더 정리 (Flutter 삭제, Manus 문서 삭제) | Claude Code | DONE | 7개 문서 + Flutter 폴더 삭제 |
| 3 | Seed Script PostgreSQL + 데이터 확장 | Claude Code | DONE | 56개+ 레스토랑 데이터 포함 |
| 4 | UI/UX 공통 컴포넌트 생성 | Claude Code | DONE | LoadingSpinner, ErrorState, EmptyState |
| 4-1 | MapPage ErrorState prop 버그 수정 | Claude Code | DONE | message → description |
| **4-2** | **기존 페이지에 공통 컴포넌트 적용** | **엔티** | **TODO** | **HIGH PRIORITY - 아래 상세 스펙 참조** |
| **5** | **검색/필터 강화** | **엔티** | **TODO** | **가격 필터 + 검색 하이라이트** |
| 6 | API 통합 데이터 수집 (KCISA + SerpAPI) | Claude Code | DONE | collect-restaurant-data.mjs |
| 7 | Admin Dashboard | 미정 | TODO | Phase 4 이후 |
| 8 | Additional Tests | 미정 | TODO | Phase 4 이후 |
| 9 | Supabase 배포 설정 | USER | TODO | 사용자가 직접 진행 필요 |
| 10 | Vercel 배포 설정 | USER | TODO | 사용자가 직접 진행 필요 |

---

## 다음 단계 로드맵 (2026-02-02)

### 즉시 진행 필요 (엔티 담당)

#### TODO 1: 기존 페이지에 공통 컴포넌트 적용 (HIGH PRIORITY)
**예상 작업량**: 4개 파일 수정
**목표**: 인라인 로딩/에러/빈 상태 코드를 재사용 가능한 컴포넌트로 교체

#### TODO 2: 검색/필터 강화 (MEDIUM PRIORITY)
**예상 작업량**: 4개 파일 수정
**목표**: 가격대 필터 추가, 검색어 하이라이트

### 사용자 진행 필요

#### TODO 3: Supabase 프로젝트 생성
1. supabase.com에서 새 프로젝트 생성
2. Google OAuth + Kakao OAuth 설정
3. `uploads` 스토리지 버킷 생성
4. `pnpm db:push`로 스키마 적용

#### TODO 4: Vercel 배포
1. GitHub repo 연결
2. 환경변수 설정 (`.env.example` 참조)
3. 배포 및 테스트

### 향후 계획 (Phase 4)

| # | Task | Priority | Description |
|---|------|----------|-------------|
| 1 | Admin Dashboard | MEDIUM | 관리자용 맛집/사용자 관리 페이지 |
| 2 | 리뷰 사진 업로드 | LOW | Supabase Storage 활용 |
| 3 | 실시간 알림 | LOW | Meal Buddy 매칭 알림 |
| 4 | 성능 최적화 | LOW | 이미지 최적화, 코드 스플리팅 |
| 5 | E2E 테스트 | LOW | Playwright 또는 Cypress |

---

## Current Agents & Roles

| Agent | Role | Phase | Status |
|-------|------|-------|--------|
| **Manus AI** | Phase 1 architect. Built full-stack foundation with tRPC, Drizzle, React 19, i18n, Maps. | Phase 1 | DONE |
| **Claude Code** | Phase 2 lead. MySQL->PG, Manus->Supabase auth, Vercel deploy, Meal Buddy, Navbar, 폴더 정리. | Phase 2-3 | ACTIVE |
| **엔티** | Phase 3 contributor. Seed data, UI/UX polish, search enhancement. | Phase 3 | READY |

---

## Task Separation: User vs AI

### USER MUST DO (requires human account access)

1. **Create Supabase Project** (supabase.com)
   - Sign up / log in to Supabase
   - Create new project (region: Northeast Asia recommended)
   - Copy: Project URL, anon key, service role key, database connection string (pooler)
   - Go to Authentication > Providers:
     - Enable Google OAuth (needs Google Cloud Console OAuth client)
     - Enable Kakao OAuth (use REST API Key: `d75cf48f0236abf66bf289ea32952bbe`)
   - Go to Storage > Create bucket named `uploads` (set to public)

2. **Create Vercel Project** (vercel.com)
   - Connect GitHub repo OR use `vercel` CLI
   - Set environment variables (see `.env.example` for full list):
     ```
     DATABASE_URL=postgresql://...
     SUPABASE_URL=https://xxx.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=eyJ...
     VITE_SUPABASE_URL=https://xxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJ...
     VITE_KAKAO_MAP_API_KEY=1c716f8fc9de5cedc4e6041882078c71
     ```

3. **Apply DB Schema** (after Supabase is ready)
   ```bash
   cd seoul_in_a_bite_web_manus
   pnpm install
   pnpm db:push
   ```

4. **Seed Initial Data** (after DB is ready)
   ```bash
   node seed-data.mjs
   ```

5. **Kakao Developers Console** (developers.kakao.com)
   - App: `seoulmusttry`
   - Register deployed domain in Web Platform settings
   - Enable Kakao Login redirect URI

---

## Project Architecture

### Directory Structure (Current - 2026-01-27 Updated)

```
seoul_in_a_bite_project_plan/
  AI_COLLABORATION.md             # 이 파일 (유일한 협업 문서)
  Seoul in a Bite 웹 애플리케이션 개발 기획안.md
  seoul_in_a_bite_project_plan.docx
  Seoul_in_a_Bite_웹_애플리케이션_개발_기획안.docx

  seoul_in_a_bite_web_manus/      # 메인 프로젝트 루트
    client/
      public/                     # Static assets
      index.html                  # HTML entry
      src/
        _core/hooks/
          useAuth.ts              # Supabase Auth hook (Google + Kakao + Email)
        components/
          ui/                     # 63 shadcn/ui components (DO NOT modify)
          AuthDialog.tsx           # Login/signup dialog
          Navbar.tsx               # [NEW] Shared navigation bar (desktop + mobile)
          MealBuddyCard.tsx        # Meal buddy post card
          MealBuddySection.tsx     # Embeddable section for restaurant detail
          CreateMealBuddyPostDialog.tsx  # Create dining post
          ErrorBoundary.tsx        # Error boundary wrapper
          GoogleMapComponent.tsx   # Google Maps integration
          KakaoMapComponent.tsx    # Kakao Maps integration
          LanguageSwitcher.tsx     # Language toggle (4 languages)
          MapSelector.tsx          # Map provider selector
        contexts/
          LanguageContext.tsx       # i18n context (ko, en, zh-TW, zh-CN)
          ThemeContext.tsx          # Theme context (light/dark ready)
        hooks/
          useMobile.tsx            # useIsMobile() hook (768px breakpoint)
        lib/
          i18n.ts                 # All translations (FLAT keys, not nested)
          trpc.ts                 # tRPC client setup
          supabase.ts             # Client Supabase instance
          restaurants.ts           # Legacy sample data (deprecated, MapPage still uses it)
        pages/
          Home.tsx                # Restaurant list + search + category filter
          RestaurantDetail.tsx     # Restaurant info + menu + reviews + meal buddy
          MapPage.tsx             # Google/Kakao Maps with markers
          MealBuddyPage.tsx       # Browse/create meal buddy posts
          MealBuddyPostDetail.tsx # Post detail + responses + chat
          ProfilePage.tsx         # User profile editor
          NotFound.tsx            # 404 page
        App.tsx                   # <Navbar /> + Router (Wouter Switch)
        main.tsx                  # Entry point (tRPC + QueryClient + Supabase token)
        index.css                 # Global styles (TailwindCSS)
    server/
      _core/
        supabase.ts               # Server Supabase admin client (service role key)
        env.ts                    # Environment variable validation
        context.ts                # tRPC context (Bearer token -> Supabase user -> DB user)
        trpc.ts                   # tRPC init (publicProcedure, protectedProcedure)
        systemRouter.ts           # Health check endpoint
        index.ts                  # Express server setup
      routers.ts                  # ALL tRPC routers
      db.ts                       # Database connection + user helpers
      restaurantDb.ts             # Restaurant CRUD (PostgreSQL, ilike search)
      mealBuddyDb.ts              # Meal Buddy CRUD
      storage.ts                  # Supabase Storage upload/URL
      reviews.test.ts             # Review + bookmark tests
      auth.logout.test.ts         # Auth logout test
    drizzle/
      schema.ts                   # PostgreSQL schema (pgTable, serial, pgEnum)
      relations.ts                # All Drizzle ORM relations
      migrations/                 # Auto-generated migration files
    supabase/                     # [NEW] SQL reference files
      schema.sql                  # Supabase-native schema with RLS policies, triggers
      sample_data.sql             # 20 sample restaurants (multilingual + GPS)
    api/
      index.ts                    # Vercel serverless entry point
    shared/
      const.ts                    # Shared constants
    API_INTEGRATION_GUIDE.md      # 한국문화정보원 + SerpAPI 가이드
    TECHNICAL_SPECIFICATION.md    # 기술 사양서 (Phase 1 기준, 참고용)
    KAKAO_MAPS_GUIDE.md           # 카카오 지도 API 가이드
    vercel.json                   # Vercel deployment config
    vite.config.ts                # Vite + React + TailwindCSS
    drizzle.config.ts             # Drizzle config (postgresql dialect)
    vitest.config.ts              # Vitest config
    tsconfig.json                 # TypeScript config
    package.json                  # Dependencies + scripts
    pnpm-lock.yaml                # Lock file
    .env.example                  # Environment variable template
    seed-data.mjs                 # Sample data seeder (현재 MySQL - PostgreSQL로 변환 필요!)
    collect-restaurant-data.mjs   # Real data collector (needs API keys)
```

### Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| UI Framework | React | 19.2.1 | Latest with concurrent features |
| Language | TypeScript | 5.9.3 | Strict mode |
| CSS | TailwindCSS | 4.1.14 | v4 with new engine |
| Build | Vite | 7.1.7 | Fast HMR |
| Routing | Wouter | 3.3.5 | 2KB lightweight |
| Components | shadcn/ui | latest | 63 components installed |
| Icons | Lucide React | 0.453.0 | |
| API | tRPC | 11.6.0 | End-to-end type safety |
| ORM | Drizzle | 0.44.5 | Type-safe SQL |
| Database | PostgreSQL | (Supabase) | Was MySQL in Phase 1 |
| Auth | Supabase Auth | 2.49.0+ | Google + Kakao + Email |
| Storage | Supabase Storage | (built-in) | Was AWS S3 in Phase 1 |
| Server | Express | 4.21.2 | Wrapped in Vercel serverless |
| Deploy | Vercel | serverless | Was Manus platform in Phase 1 |
| Testing | Vitest | latest | Unit tests |
| Package Manager | pnpm | - | NOT npm, NOT yarn |

### Database Schema (PostgreSQL via Drizzle ORM)

```
users
  id: serial PK
  supabaseId: varchar(128) UNIQUE     # Supabase Auth user ID
  email: varchar(320)
  name: text
  loginMethod: varchar(64)
  role: enum('user', 'admin')
  createdAt, updatedAt, lastSignedIn: timestamp

restaurants
  id: serial PK
  name: text NOT NULL                 # Korean
  nameEn: text                        # English
  nameZhTw: text                      # Traditional Chinese
  nameZhCn: text                      # Simplified Chinese
  category: enum('korean','cafe','streetFood','bbq','seafood','dessert','noodles','chicken')
  address: text NOT NULL
  addressEn, addressZhTw, addressZhCn: text
  phone: varchar(20)
  hours: text
  description: text                   # Korean
  descriptionEn, descriptionZhTw, descriptionZhCn: text
  image: text                         # Image URL
  latitude: varchar(20) NOT NULL
  longitude: varchar(20) NOT NULL
  rating: integer NOT NULL DEFAULT 0  # NOTE: value * 10 (45 = 4.5 stars)
  reviewCount: integer NOT NULL DEFAULT 0
  price: enum('cheap','moderate','expensive')
  createdAt, updatedAt: timestamp

menuItems (table: menu_items)
  id: serial PK
  restaurantId: integer NOT NULL      # FK -> restaurants
  name: text NOT NULL                 # Korean
  nameEn, nameZhTw, nameZhCn: text
  description: text                   # Korean
  descriptionEn, descriptionZhTw, descriptionZhCn: text
  price: integer NOT NULL             # Korean Won
  createdAt: timestamp

reviews
  id: serial PK
  restaurantId: integer NOT NULL
  userId: integer NOT NULL
  rating: integer NOT NULL            # 1-5
  text: text
  createdAt, updatedAt: timestamp

bookmarks
  id: serial PK
  userId: integer NOT NULL
  restaurantId: integer NOT NULL
  createdAt: timestamp
  UNIQUE(userId, restaurantId)

userProfiles (table: user_profiles)
  id: serial PK
  userId: integer NOT NULL UNIQUE
  displayName: varchar(100) NOT NULL
  nationality: varchar(64)
  preferredLanguage: varchar(10)
  foodPreferences: text
  bio: text
  profileImage: text
  contactMethod: varchar(20)          # 'kakao' | 'line' | 'whatsapp' | 'email' | 'instagram'
  contactInfo: varchar(200)
  isVerified: boolean DEFAULT false
  createdAt, updatedAt: timestamp

mealBuddyPosts (table: meal_buddy_posts)
  id: serial PK
  restaurantId: integer NOT NULL
  creatorId: integer NOT NULL
  title: varchar(200) NOT NULL
  description: text
  diningDate: timestamp NOT NULL
  maxCompanions: integer DEFAULT 2
  currentCompanions: integer DEFAULT 0
  preferredLanguages: text            # JSON array: '["ko","en"]'
  status: enum('open','full','completed','cancelled')
  createdAt, updatedAt: timestamp

mealBuddyResponses (table: meal_buddy_responses)
  id: serial PK
  postId: integer NOT NULL
  responderId: integer NOT NULL
  message: text
  status: enum('pending','accepted','declined','cancelled')
  createdAt, updatedAt: timestamp

mealBuddyMessages (table: meal_buddy_messages)
  id: serial PK
  postId: integer NOT NULL
  senderId: integer NOT NULL
  content: text NOT NULL
  createdAt: timestamp
```

### Authentication Flow

```
Client                          Server                         Supabase
  |                               |                               |
  |-- supabase.auth.signIn() --->|                               |
  |                               |                               |
  |<-- session (access_token) ---|                               |
  |                               |                               |
  |-- tRPC request ------------->|                               |
  |   Authorization: Bearer xxx   |                               |
  |                               |-- supabaseAdmin.auth         |
  |                               |   .getUser(token) ---------->|
  |                               |                               |
  |                               |<-- Supabase user data -------|
  |                               |                               |
  |                               |-- Find/create in local DB    |
  |                               |   (users table by supabaseId)|
  |                               |                               |
  |<-- tRPC response ------------|                               |
```

### tRPC API Endpoints

```
auth.me              -> GET current user (public, returns null if not logged in)
auth.logout          -> POST logout (public, client handles supabase.auth.signOut())

restaurants.list     -> GET all restaurants (public)
restaurants.byId     -> GET restaurant by id (public)
restaurants.byCategory -> GET by category (public)
restaurants.search   -> GET search by query (public, uses ilike)

menuItems.byRestaurant -> GET menu items by restaurant id (public)

reviews.byRestaurant -> GET reviews by restaurant id (public)
reviews.create       -> POST create review (protected)
reviews.update       -> PUT update review (protected)
reviews.delete       -> DELETE review (protected)

bookmarks.list       -> GET user's bookmarks (protected)
bookmarks.isBookmarked -> GET check if bookmarked (protected)
bookmarks.create     -> POST bookmark (protected)
bookmarks.delete     -> DELETE bookmark (protected)

mealBuddy.getProfile     -> GET user profile (protected)
mealBuddy.updateProfile  -> POST upsert profile (protected)
mealBuddy.allPosts       -> GET all open posts (public)
mealBuddy.postsByRestaurant -> GET posts for restaurant (public)
mealBuddy.getPost        -> GET single post with responses (public)
mealBuddy.createPost     -> POST create post (protected)
mealBuddy.updatePostStatus -> POST update post status (protected, owner only)
mealBuddy.myPosts        -> GET my posts (protected)
mealBuddy.responsesByPost -> GET responses to a post (protected)
mealBuddy.createResponse -> POST respond to post (protected)
mealBuddy.handleResponse -> POST accept/decline response (protected, owner only)
mealBuddy.myResponses    -> GET my responses (protected)
mealBuddy.getMatchedContact -> GET contact info (protected, only if accepted)
mealBuddy.getMessages    -> GET messages for post (protected, creator or accepted)
mealBuddy.sendMessage    -> POST send message (protected, creator or accepted)
```

---

## Coding Conventions (MUST FOLLOW)

### i18n Translation System
- **FLAT keys only**, not nested. Use `t("mealBuddy")` NOT `t("mealBuddy.title")`
- All 4 languages must be updated: `ko`, `en`, `zh-TW`, `zh-CN`
- File: `client/src/lib/i18n.ts`
- Usage: `const { t } = useLanguage();`

### Component Style
- Functional components only (no class components)
- Props interface at top of file
- Color palette: orange/amber tone (`bg-orange-500`, `text-orange-600`, `border-orange-100`)
- Background gradient: `bg-gradient-to-br from-orange-50 via-white to-amber-50`
- Glass morphism navbar: `bg-white/80 backdrop-blur-md`
- Mobile-first responsive design
- Use shadcn/ui components from `@/components/ui/`
- Use `lucide-react` for icons

### Database Conventions
- Restaurant `rating` stored as integer * 10 (45 = 4.5 stars)
- Use `ilike` for search (PostgreSQL case-insensitive)
- `onConflictDoUpdate` for upserts (not `onDuplicateKeyUpdate`)
- Always use Drizzle query builder, never raw SQL
- Table names in schema: camelCase variable, snake_case SQL name

### Auth Conventions
- `publicProcedure` for unauthenticated routes
- `protectedProcedure` for authenticated routes (throws UNAUTHORIZED if no user)
- Access `ctx.user` in protected procedures
- Client sends Supabase `access_token` as `Authorization: Bearer <token>`

### File Naming
- Pages: PascalCase in `client/src/pages/` (e.g., `MealBuddyPage.tsx`)
- Components: PascalCase in `client/src/components/` (e.g., `MealBuddyCard.tsx`)
- Server modules: camelCase in `server/` (e.g., `mealBuddyDb.ts`)
- Tests: `*.test.ts` next to source file

---

## Completed Work Log

### Phase 1: Manus AI (Foundation)
- Full-stack setup: React 19 + tRPC + Drizzle + Express
- 63 shadcn/ui components
- 4-language i18n system
- Google Maps + Kakao Maps integration
- Restaurant list/detail/search pages
- Review system, bookmark system

### Phase 2: Claude Code (Migration)
- MySQL -> PostgreSQL migration
- Manus OAuth -> Supabase Auth (Google + Kakao + Email)
- AWS S3 -> Supabase Storage
- Vercel serverless deployment structure
- Meal Buddy feature (posts, responses, messages, profiles)
- Deleted 11 Manus-specific files

### Phase 3: Claude Code + 엔티 (Enhancements) - IN PROGRESS
- [DONE] Shared Navigation Component (`Navbar.tsx`)
  - Desktop: horizontal nav links + language switcher + auth
  - Mobile: hamburger -> Sheet drawer
  - Detail pages: back button auto-detection
  - Applied to all pages via `App.tsx`
- [DONE] 폴더 정리
  - Flutter mobile project (`seoul_in_a_bite/`) 삭제
  - SQL reference files (`supabase/`) 웹 프로젝트로 이동
  - Manus-era docs 7개 삭제 (FOR_CLAUDE_CODE.md, FOR_ANTIGRAVITY.md, DESIGN_REQUEST_FOR_STITCH.md, DESIGN_FLOW_FOR_STITCH.md, WORK_STATUS.md, todo.md, PRESENTATION_SCRIPT.md)
- [DONE] Seed Script PostgreSQL 변환 확인 (이미 완료됨, 56개+ 레스토랑)
- [DONE] UI/UX 공통 컴포넌트 3개 생성 (LoadingSpinner, ErrorState, EmptyState) -> Claude Code
- [DONE] MapPage ErrorState prop 버그 수정 (message → description) -> Claude Code
- [DONE] API 통합 데이터 수집 스크립트 재작성 (KCISA + SerpAPI) -> Claude Code (2026-01-28)
  - `collect-restaurant-data.mjs` 완전 재작성: PostgreSQL, 3단계 수집, 중복 검사, CLI 옵션
  - `.env.example`에 KCISA_API_KEY, SERPAPI_KEY 추가
- [TODO] 기존 페이지에 공통 컴포넌트 적용 (Home, RestaurantDetail, MealBuddy 등) -> 엔티
- [TODO] 검색/필터 강화 -> 엔티

---

## Decision Log

| Date | Agent | Decision | Reason |
|------|-------|----------|--------|
| 2026-01-27 | Manus | tRPC for API | End-to-end type safety |
| 2026-01-27 | Manus | MySQL + Drizzle ORM | Relational data, type-safe queries |
| 2026-01-27 | Manus | Wouter for routing | Lightweight (2KB) vs React Router |
| 2026-01-27 | Manus | shadcn/ui for components | Accessible, customizable, modern |
| 2026-01-27 | Claude Code | MySQL -> PostgreSQL | Supabase uses PostgreSQL |
| 2026-01-27 | Claude Code | Supabase Auth (Google + Kakao + Email) | User requested Supabase; Kakao important for Korea |
| 2026-01-27 | Claude Code | Vercel serverless deployment | User chose Vercel |
| 2026-01-27 | Claude Code | Meal Buddy with in-app messaging | User requested dining companion feature |
| 2026-01-27 | Claude Code | Polling for messages (5s) | Simple, no WebSocket needed for MVP |
| 2026-01-27 | Claude Code | Flat i18n keys (not nested) | Existing codebase convention |
| 2026-01-27 | Claude Code | Shared Navbar in App.tsx | Consistent navigation across all pages |
| 2026-01-27 | Claude Code | Common UI components (Loading/Error/Empty) | Reusable state components for all pages |
| 2026-01-27 | Claude Code | ErrorState prop fix in MapPage | message → description (prop name mismatch) |
| 2026-01-28 | Claude Code | KCISA + SerpAPI 통합 스크립트 재작성 | 실제 맛집 데이터 자동 수집, 샘플→운영 데이터 전환 |
| 2026-01-28 | Claude Code | Native fetch (not axios) for data collection | Node.js 22 내장 fetch 사용, 의존성 추가 불필요 |
| 2026-01-28 | Claude Code | postgres template literals (not Drizzle) for scripts | seed-data.mjs 패턴 일관성, .mjs에서 TS 빌드 불필요 |
| 2026-01-28 | Claude Code | Chinese translations null (not placeholder) | API에서 중국어 미제공, 향후 번역 API로 별도 처리 |

---

## Kakao API Keys (provided by user)

- App Name: `seoulmusttry`
- JavaScript Key: `1c716f8fc9de5cedc4e6041882078c71` (for Kakao Maps)
- REST API Key: `d75cf48f0236abf66bf289ea32952bbe`
- Native App Key: `f6284fb5662cf0959194ed0e1cf42bfb`

---

## Key Files Quick Reference

| Purpose | File Path |
|---------|-----------|
| App routing + Navbar | `client/src/App.tsx` |
| Shared navigation | `client/src/components/Navbar.tsx` |
| Home page | `client/src/pages/Home.tsx` |
| Restaurant detail | `client/src/pages/RestaurantDetail.tsx` |
| Map page | `client/src/pages/MapPage.tsx` |
| Meal Buddy list | `client/src/pages/MealBuddyPage.tsx` |
| Meal Buddy detail | `client/src/pages/MealBuddyPostDetail.tsx` |
| Profile page | `client/src/pages/ProfilePage.tsx` |
| Login dialog | `client/src/components/AuthDialog.tsx` |
| API routes | `server/routers.ts` |
| Restaurant DB | `server/restaurantDb.ts` |
| Meal Buddy DB | `server/mealBuddyDb.ts` |
| DB schema | `drizzle/schema.ts` |
| Relations | `drizzle/relations.ts` |
| Translations | `client/src/lib/i18n.ts` |
| Auth hook | `client/src/_core/hooks/useAuth.ts` |
| Supabase (client) | `client/src/lib/supabase.ts` |
| Supabase (server) | `server/_core/supabase.ts` |
| Build config | `vite.config.ts` |
| Vercel config | `vercel.json` |
| Serverless entry | `api/index.ts` |
| Dependencies | `package.json` |
| Environment vars | `.env.example` |
| Seed data | `seed-data.mjs` (PostgreSQL 변환 완료) |
| Data collector | `collect-restaurant-data.mjs` (KCISA + SerpAPI 통합) |
| SQL reference | `supabase/schema.sql`, `supabase/sample_data.sql` |
| API guide | `API_INTEGRATION_GUIDE.md` |

---

## Deployment Checklist

### Step 1: Supabase Setup (USER)
- [ ] Create Supabase project
- [ ] Get URL, anon key, service role key, DB connection string
- [ ] Enable Google OAuth provider
- [ ] Enable Kakao OAuth provider
- [ ] Create `uploads` storage bucket (public)
- [ ] Run `pnpm db:push` to apply schema

### Step 2: Vercel Setup (USER)
- [ ] Connect GitHub repo or use `vercel deploy`
- [ ] Set environment variables from `.env.example`
- [ ] Deploy

### Step 3: Post-Deploy Verification
- [ ] All pages load correctly
- [ ] Auth works (login/signup/logout)
- [ ] Restaurant list/detail/search works
- [ ] Meal buddy works (create post, respond, chat)
- [ ] All 4 language switches work
- [ ] Kakao Maps loads on deployed domain
- [ ] Navigation bar works on desktop + mobile

---

## Important Notes for Any Agent

1. **All Manus dependencies removed.** The project is fully independent. Do NOT reference Manus SDK, OAuth, Forge API, etc.
2. **PostgreSQL, not MySQL.** Use `pg-core` imports, `ilike` for search, `onConflictDoUpdate` for upserts.
3. **Supabase Auth.** Bearer token in Authorization header, verified server-side with `supabaseAdmin.auth.getUser(token)`.
4. **Rating convention.** Restaurant `rating` is integer * 10 (45 = 4.5 stars). Keep this.
5. **i18n uses flat keys.** `t("mealBuddy")` not `t("mealBuddy.title")`. Always update all 4 languages.
6. **Meal Buddy chat uses polling (5s).** For production scale, consider WebSockets later.
7. **Package manager is pnpm.** Not npm, not yarn.
8. **Project root**: `D:\AI _coding_project_all\seoul_in_a_bite_project_plan\seoul_in_a_bite_web_manus`
9. **seed-data.mjs is PostgreSQL.** Uses `postgres` template literals. Already has 56+ restaurants.
13. **collect-restaurant-data.mjs** collects real data from KCISA + SerpAPI. Run with `node collect-restaurant-data.mjs --help` for options.
14. **KCISA_API_KEY and SERPAPI_KEY** are required for data collection. See `.env.example`.
10. **Navbar is in App.tsx.** All pages share the same `<Navbar />`. Do NOT add per-page headers.
11. **Navbar height is h-14 (56px).** Sticky elements should use `top-16` offset.
12. **supabase/ folder is reference only.** The actual schema is managed by Drizzle ORM (`drizzle/schema.ts`).

---

## 투두 체크리스트 (Progress Tracking)

### Phase 3 - 엔티 작업
- [ ] **작업 #4-2**: 기존 페이지에 공통 컴포넌트 적용
  - [ ] Home.tsx - LoadingSpinner, EmptyState 적용
  - [ ] RestaurantDetail.tsx - LoadingSpinner, ErrorState 적용
  - [ ] MealBuddyPage.tsx - LoadingSpinner, EmptyState 적용
  - [ ] MealBuddyPostDetail.tsx - LoadingSpinner, ErrorState 적용
- [ ] **작업 #5**: 검색/필터 강화
  - [ ] Home.tsx - 가격 필터 UI 추가
  - [ ] server/routers.ts - 가격 필터 endpoint
  - [ ] 검색어 하이라이트 기능
  - [ ] i18n.ts - 새 번역 키 추가

### Phase 3 - 사용자 작업
- [ ] Supabase 프로젝트 생성
  - [ ] Google OAuth 설정
  - [ ] Kakao OAuth 설정
  - [ ] uploads 버킷 생성
  - [ ] `pnpm db:push` 실행
- [ ] Vercel 배포
  - [ ] GitHub 연결
  - [ ] 환경변수 설정
  - [ ] 배포 확인

### Phase 4 (향후)
- [ ] Admin Dashboard
- [ ] 리뷰 사진 업로드
- [ ] 실시간 알림
- [ ] 성능 최적화
- [ ] E2E 테스트

---

## 변경 이력 (Changelog)

| 날짜 | 담당자 | 변경 내용 |
|------|--------|----------|
| 2026-01-27 | Manus AI | Phase 1 완료 - Full-stack 기반 구축 |
| 2026-01-27 | Claude Code | Phase 2 완료 - MySQL→PostgreSQL, Supabase 마이그레이션 |
| 2026-01-27 | Claude Code | Navbar 컴포넌트 생성, 폴더 정리 |
| 2026-01-28 | Claude Code | 공통 UI 컴포넌트 생성, API 통합 스크립트 작성 |
| 2026-02-02 | Claude Code | AI_COLLABORATION.md 업데이트, 투두 체크리스트 추가, GitHub 연결 |
