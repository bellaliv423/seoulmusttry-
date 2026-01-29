# Kakao Maps API 사용 가이드

## 개요

Seoul in a Bite 프로젝트에서 Kakao Maps API를 사용하여 맛집 위치를 지도에 표시합니다.

## API 키 발급

### 1. 카카오 개발자 사이트 접속
- URL: https://developers.kakao.com
- 카카오 계정으로 로그인

### 2. 애플리케이션 생성
1. "내 애플리케이션" 메뉴 클릭
2. "애플리케이션 추가하기" 버튼 클릭
3. 앱 이름, 사업자명 입력 후 저장

### 3. JavaScript 키 발급
1. 생성한 앱 선택
2. [앱 설정] > [앱 키] 메뉴 이동
3. "JavaScript 키" 복사

### 4. 플랫폼 등록
1. [앱 설정] > [플랫폼] 메뉴 이동
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인 등록 (예: `http://localhost:3000`, `https://yourdomain.com`)

**중요:** 등록한 도메인에서만 API가 작동합니다!

---

## 프로젝트에 적용하기

### 1. 환경변수 설정

프로젝트 루트에 `.env` 파일 생성 (또는 Manus 관리 UI에서 설정):

\`\`\`env
VITE_KAKAO_MAP_API_KEY=발급받은_JavaScript_키
\`\`\`

### 2. HTML에 스크립트 추가

`client/index.html` 파일에 Kakao Maps SDK 스크립트가 이미 추가되어 있습니다:

\`\`\`html
<script
  type="text/javascript"
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAP_API_KEY&libraries=services,clusterer,drawing"
></script>
\`\`\`

### 3. 기본 사용법

\`\`\`typescript
// 지도 컨테이너
const mapContainer = document.getElementById('map');

// 지도 옵션
const mapOption = {
  center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심 좌표
  level: 3 // 확대 레벨 (1~14, 숫자가 작을수록 확대)
};

// 지도 생성
const map = new kakao.maps.Map(mapContainer, mapOption);
\`\`\`

### 4. 마커 추가

\`\`\`typescript
// 마커 위치
const markerPosition = new kakao.maps.LatLng(37.5665, 126.9780);

// 마커 생성
const marker = new kakao.maps.Marker({
  position: markerPosition,
  map: map
});

// 인포윈도우 (말풍선)
const infowindow = new kakao.maps.InfoWindow({
  content: '<div style="padding:5px;">맛집 이름</div>'
});

// 마커 클릭 이벤트
kakao.maps.event.addListener(marker, 'click', function() {
  infowindow.open(map, marker);
});
\`\`\`

---

## 현재 프로젝트 구현 상태

### 파일 위치
- `client/src/components/KakaoMapComponent.tsx` - Kakao Maps 컴포넌트
- `client/src/pages/MapPage.tsx` - 지도 페이지

### 주요 기능
1. **지도 표시** - 서울 중심으로 지도 표시
2. **맛집 마커** - 모든 맛집 위치에 마커 표시
3. **마커 클릭** - 마커 클릭 시 맛집 정보 표시
4. **카테고리 필터** - 카테고리별 맛집 필터링

---

## 유용한 샘플 코드

### 여러 개 마커 표시

\`\`\`typescript
const restaurants = [
  { name: '맛집1', lat: 37.5665, lng: 126.9780 },
  { name: '맛집2', lat: 37.5675, lng: 126.9790 },
];

restaurants.forEach(restaurant => {
  const marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(restaurant.lat, restaurant.lng),
    map: map
  });
  
  const infowindow = new kakao.maps.InfoWindow({
    content: \`<div style="padding:5px;">\${restaurant.name}</div>\`
  });
  
  kakao.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map, marker);
  });
});
\`\`\`

### 지도 중심 이동

\`\`\`typescript
// 부드럽게 이동
map.panTo(new kakao.maps.LatLng(37.5665, 126.9780));

// 즉시 이동
map.setCenter(new kakao.maps.LatLng(37.5665, 126.9780));
\`\`\`

### 지도 레벨 변경

\`\`\`typescript
// 확대
map.setLevel(map.getLevel() - 1);

// 축소
map.setLevel(map.getLevel() + 1);
\`\`\`

---

## 참고 자료

- **공식 문서**: https://apis.map.kakao.com/web/documentation/
- **샘플 코드**: https://apis.map.kakao.com/web/sample/
- **개발자 사이트**: https://developers.kakao.com

---

## 문제 해결

### 지도가 표시되지 않을 때

1. **API 키 확인**
   - 환경변수에 올바른 키가 설정되었는지 확인
   - 개발자 사이트에서 키가 활성화되었는지 확인

2. **도메인 등록 확인**
   - 현재 접속 중인 도메인이 카카오 개발자 사이트에 등록되어 있는지 확인
   - `localhost`와 `127.0.0.1`은 별도로 등록해야 함

3. **스크립트 로드 확인**
   - 브라우저 개발자 도구(F12) > Console 탭에서 에러 확인
   - `kakao is not defined` 에러가 나면 스크립트가 로드되지 않은 것

4. **지도 컨테이너 크기 확인**
   - 지도를 표시할 div에 `width`와 `height`가 설정되어 있는지 확인
   - 크기가 0이면 지도가 표시되지 않음

---

## 다음 단계

1. **실제 맛집 데이터 연동** - 데이터베이스의 맛집 위치 정보를 지도에 표시
2. **검색 기능** - 주소나 키워드로 맛집 검색
3. **길찾기 기능** - 현재 위치에서 맛집까지의 경로 표시
4. **클러스터링** - 많은 마커를 효율적으로 표시
