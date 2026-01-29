# Seoul in a Bite - 기술 명세서 (Technical Specification)

## 📋 프로젝트 개요

**프로젝트명**: Seoul in a Bite (한입에 서울 / 首爾美食)  
**목표**: 대만 관광객 및 외국인을 위한 AI 기반 맛집 큐레이션 플랫폼  
**플랫폼**: 모바일 반응형 웹 애플리케이션  
**기술 스택**: React 19 + TypeScript + TailwindCSS 4 + Vite

---

## 🏗️ 아키텍처

### 프론트엔드 구조

```
client/
├── src/
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── GoogleMapComponent.tsx
│   │   ├── KakaoMapComponent.tsx
│   │   ├── MapSelector.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ... (shadcn/ui 컴포넌트)
│   ├── contexts/            # React Context (다국어, 테마)
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── RestaurantDetail.tsx
│   │   ├── MapPage.tsx
│   │   └── NotFound.tsx
│   ├── lib/                 # 유틸리티 함수 및 데이터
│   │   ├── i18n.ts          # 다국어 번역 데이터
│   │   └── restaurants.ts   # 맛집 데이터 모델
│   ├── App.tsx              # 라우팅 및 앱 진입점
│   ├── main.tsx             # React 진입점
│   └── index.css            # 전역 스타일 (TailwindCSS)
├── public/                  # 정적 자산
└── index.html               # HTML 템플릿
```

---

## 🌐 다국어 지원 (i18n)

### 지원 언어

| 언어코드 | 언어명 | 사용 지역 |
| :--- | :--- | :--- |
| `zh-TW` | 繁體中文 (번체자) | 대만, 홍콩 (기본값) |
| `zh-CN` | 简体中文 (간체자) | 중국 본토 |
| `en` | English | 국제 사용자 |
| `ko` | 한국어 | 한국 사용자 |

### 구현 방식

- **저장소**: `client/src/lib/i18n.ts`
- **Context**: `client/src/contexts/LanguageContext.tsx`
- **저장소**: `localStorage`에 사용자 선택 언어 저장
- **사용법**: `useLanguage()` 훅으로 `t()` 함수 사용

```typescript
const { language, setLanguage, t } = useLanguage();
const title = t('appName'); // 현재 언어로 번역된 문자열 반환
```

---

## 🗺️ 지도 통합

### Google Maps API

**파일**: `client/src/components/GoogleMapComponent.tsx`

**기능**:
- 마커 표시 (맛집 위치)
- 마커 클릭 시 맛집 정보 표시
- 지도 확대/축소
- 마커 색상 변경 (선택 상태)

**설정**:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,geometry"></script>
```

**환경변수**: `.env`에 `VITE_GOOGLE_MAPS_API_KEY` 설정 필요

### Kakao Maps API

**파일**: `client/src/components/KakaoMapComponent.tsx`

**기능**:
- 마커 표시 (맛집 위치)
- 정보 윈도우 (맛집 정보 팝업)
- 지도 확대/축소
- 마커 클릭 시 정보 표시

**설정**:
```html
<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services,clusterer,drawing"></script>
```

**환경변수**: `.env`에 `VITE_KAKAO_MAPS_APP_KEY` 설정 필요

### 지도 선택기

**파일**: `client/src/components/MapSelector.tsx`

- Google Maps와 Kakao Maps 간 탭 전환
- 두 지도 모두 동일한 인터페이스 제공

---

## 📱 페이지 구조

### 1. 홈 페이지 (`/`)

**파일**: `client/src/pages/Home.tsx`

**기능**:
- 맛집 목록 표시
- 카테고리별 필터링 (8개 카테고리)
- 검색 기능
- 북마크 기능
- 맛집 상세 페이지로 이동
- 지도 페이지로 이동

**카테고리**:
- 🍚 한식 (Korean)
- ☕ 카페 (Cafe)
- 🍢 분식 (Street Food)
- 🥩 고기 (BBQ/Meat)
- 🦐 해물 (Seafood)
- 🍰 디저트 (Dessert)
- 🍜 면요리 (Noodles)
- 🍗 치킨 (Fried Chicken)

### 2. 맛집 상세 페이지 (`/restaurant/:id`)

**파일**: `client/src/pages/RestaurantDetail.tsx`

**기능**:
- 맛집 상세 정보 (주소, 전화, 영업시간)
- 메뉴 목록 및 가격
- 사용자 리뷰 및 평점
- 북마크 기능
- 전화 걸기 기능
- 지도 보기 버튼

### 3. 지도 페이지 (`/map`)

**파일**: `client/src/pages/MapPage.tsx`

**기능**:
- Google Maps / Kakao Maps 선택
- 모든 맛집 위치 표시
- 맛집 목록 (우측 사이드바)
- 맛집 선택 시 지도 자동 이동
- 맛집 상세 페이지로 이동

---

## 🎨 디자인 시스템

### 색상 팔레트

| 용도 | 색상명 | 색상코드 | 사용처 |
| :--- | :--- | :--- | :--- |
| Primary | 오렌지 | `#FF6B35` | 버튼, 강조 요소 |
| Secondary | 남색 | `#1A1A2E` | 텍스트, 배경 |
| Accent | 노랑 | `#FFE66D` | 강조, 하이라이트 |
| Background | 밝은 회색 | `#FAFAFA` | 배경 |
| Error | 빨강 | `#E53935` | 에러 메시지 |

### 타이포그래피

- **폰트**: Noto Sans KR (Google Fonts)
- **제목**: Bold (700)
- **본문**: Regular (400)
- **강조**: SemiBold (600)

### 반응형 디자인

| 디바이스 | 너비 | 레이아웃 |
| :--- | :--- | :--- |
| 모바일 | < 640px | 1열 |
| 태블릿 | 640px - 1024px | 2열 |
| 데스크톱 | > 1024px | 3열 |

---

## 📊 데이터 모델

### Restaurant 인터페이스

```typescript
interface Restaurant {
  id: string;
  name: string;
  category: 'korean' | 'cafe' | 'streetFood' | 'bbq' | 'seafood' | 'dessert' | 'noodles' | 'chicken';
  address: string;
  phone: string;
  rating: number;           // 1-5
  reviewCount: number;
  price: 'cheap' | 'moderate' | 'expensive';
  hours: string;
  description: string;
  image: string;            // URL
  latitude: number;
  longitude: number;
  menu: MenuItem[];
}
```

### MenuItem 인터페이스

```typescript
interface MenuItem {
  name: string;
  price: number;
  description: string;
}
```

### Review 인터페이스

```typescript
interface Review {
  id: string;
  restaurantId: string;
  author: string;
  rating: number;           // 1-5
  text: string;
  date: string;             // YYYY-MM-DD
}
```

---

## 🔄 라우팅

**라우터**: Wouter (경량 라우팅 라이브러리)

| 경로 | 컴포넌트 | 설명 |
| :--- | :--- | :--- |
| `/` | Home | 홈 페이지 - 맛집 목록 |
| `/restaurant/:id` | RestaurantDetail | 맛집 상세 정보 |
| `/map` | MapPage | 지도 보기 |
| `/404` | NotFound | 404 페이지 |

---

## 🚀 배포 및 환경 설정

### 필수 환경변수

```env
# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Kakao Maps API
VITE_KAKAO_MAPS_APP_KEY=your_kakao_maps_app_key

# Analytics (선택사항)
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### 빌드 및 배포

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

---

## 📦 의존성

### 주요 패키지

- **React 19**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **TailwindCSS 4**: 유틸리티 CSS
- **Vite**: 빌드 도구
- **Wouter**: 경량 라우팅
- **Lucide React**: 아이콘 라이브러리
- **shadcn/ui**: UI 컴포넌트 라이브러리

---

## 🔒 보안 고려사항

1. **API 키 관리**
   - 모든 API 키는 환경변수에 저장
   - 클라이언트 사이드에서 노출되지 않도록 주의

2. **CORS 설정**
   - Google Maps: 도메인 제한 설정
   - Kakao Maps: 앱 키 도메인 제한 설정

3. **데이터 검증**
   - 사용자 입력 검증
   - XSS 방지

---

## 🎯 향후 개선 사항

1. **백엔드 통합**
   - Supabase를 통한 실제 데이터베이스 연동
   - 사용자 인증 (소셜 로그인)
   - 리뷰 작성 기능

2. **고급 기능**
   - 실시간 식사 동행 매칭
   - AI 기반 맛집 추천
   - 결제 시스템 연동

3. **모바일 앱**
   - Flutter를 통한 네이티브 모바일 앱
   - 오프라인 모드 지원
   - 푸시 알림

4. **성능 최적화**
   - 이미지 최적화
   - 코드 스플리팅
   - 캐싱 전략

---

## 📞 개발 문의

프로젝트 관련 문의는 GitHub Issues에 등록하세요.
