export interface Restaurant {
  id: string;
  name: string;
  category: 'korean' | 'cafe' | 'streetFood' | 'bbq' | 'seafood' | 'dessert' | 'noodles' | 'chicken';
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  price: 'cheap' | 'moderate' | 'expensive';
  hours: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  menu: MenuItem[];
}

export interface MenuItem {
  name: string;
  price: number;
  description: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

// Sample restaurant data
export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: '명동 교자',
    category: 'korean',
    address: '서울시 중구 명동 1-1',
    phone: '02-1234-5678',
    rating: 4.8,
    reviewCount: 342,
    price: 'moderate',
    hours: '11:00 - 22:00',
    description: '서울의 가장 유명한 교자 전문점',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    latitude: 37.5625,
    longitude: 126.9842,
    menu: [
      { name: '교자', price: 8000, description: '수제 교자' },
      { name: '우동', price: 9000, description: '신선한 우동' },
      { name: '만두국', price: 10000, description: '따뜻한 만두국' },
    ],
  },
  {
    id: '2',
    name: '강남 커피 로스터',
    category: 'cafe',
    address: '서울시 강남구 강남대로 1-1',
    phone: '02-2345-6789',
    rating: 4.6,
    reviewCount: 215,
    price: 'moderate',
    hours: '08:00 - 21:00',
    description: '프리미엄 커피를 제공하는 로스터리',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop',
    latitude: 37.4979,
    longitude: 127.0276,
    menu: [
      { name: '에스프레소', price: 4500, description: '싱글 샷' },
      { name: '카푸치노', price: 5500, description: '크리미한 카푸치노' },
      { name: '아메리카노', price: 4000, description: '아이스 아메리카노' },
    ],
  },
  {
    id: '3',
    name: '홍대 떡볶이',
    category: 'streetFood',
    address: '서울시 마포구 홍대입구로 1-1',
    phone: '02-3456-7890',
    rating: 4.5,
    reviewCount: 189,
    price: 'cheap',
    hours: '12:00 - 23:00',
    description: '매콤한 떡볶이의 맛을 느껴보세요',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    latitude: 37.5550,
    longitude: 126.9242,
    menu: [
      { name: '떡볶이', price: 5000, description: '매콤한 떡볶이' },
      { name: '순대', price: 6000, description: '신선한 순대' },
      { name: '튀김', price: 3000, description: '바삭한 튀김' },
    ],
  },
  {
    id: '4',
    name: '강남 고기집',
    category: 'bbq',
    address: '서울시 강남구 테헤란로 1-1',
    phone: '02-4567-8901',
    rating: 4.7,
    reviewCount: 267,
    price: 'expensive',
    hours: '17:00 - 23:00',
    description: '프리미엄 한우를 즐길 수 있는 곳',
    image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop',
    latitude: 37.4979,
    longitude: 127.0276,
    menu: [
      { name: '한우 등심', price: 45000, description: '최고급 한우' },
      { name: '한우 갈비', price: 55000, description: '부드러운 갈비' },
      { name: '소주', price: 15000, description: '프리미엄 소주' },
    ],
  },
  {
    id: '5',
    name: '을지로 해물탕',
    category: 'seafood',
    address: '서울시 중구 을지로 1-1',
    phone: '02-5678-9012',
    rating: 4.6,
    reviewCount: 198,
    price: 'moderate',
    hours: '11:00 - 22:00',
    description: '신선한 해물로 만든 해물탕',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    latitude: 37.5664,
    longitude: 126.9976,
    menu: [
      { name: '해물탕', price: 25000, description: '신선한 해물탕' },
      { name: '생선구이', price: 20000, description: '맛있는 생선구이' },
      { name: '새우튀김', price: 15000, description: '바삭한 새우튀김' },
    ],
  },
  {
    id: '6',
    name: '이태원 디저트',
    category: 'dessert',
    address: '서울시 용산구 이태원로 1-1',
    phone: '02-6789-0123',
    rating: 4.4,
    reviewCount: 156,
    price: 'moderate',
    hours: '10:00 - 20:00',
    description: '수제 디저트와 케이크 전문점',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    latitude: 37.5326,
    longitude: 126.9923,
    menu: [
      { name: '초콜릿 케이크', price: 8000, description: '진한 초콜릿 케이크' },
      { name: '딸기 타르트', price: 7000, description: '신선한 딸기 타르트' },
      { name: '마카롱', price: 3000, description: '프랑스식 마카롱' },
    ],
  },
  {
    id: '7',
    name: '종로 국수',
    category: 'noodles',
    address: '서울시 종로구 종로 1-1',
    phone: '02-7890-1234',
    rating: 4.5,
    reviewCount: 234,
    price: 'cheap',
    hours: '11:00 - 21:00',
    description: '전통 국수 맛을 느껴보세요',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    latitude: 37.5735,
    longitude: 126.9921,
    menu: [
      { name: '냉면', price: 8000, description: '시원한 냉면' },
      { name: '우동', price: 7000, description: '쫄깃한 우동' },
      { name: '국수', price: 6000, description: '전통 국수' },
    ],
  },
  {
    id: '8',
    name: '신촌 치킨',
    category: 'chicken',
    address: '서울시 서대문구 신촌로 1-1',
    phone: '02-8901-2345',
    rating: 4.3,
    reviewCount: 178,
    price: 'cheap',
    hours: '16:00 - 23:00',
    description: '바삭한 치킨의 최고봉',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
    latitude: 37.5565,
    longitude: 126.9359,
    menu: [
      { name: '양념 치킨', price: 18000, description: '매콤한 양념 치킨' },
      { name: '간장 치킨', price: 18000, description: '진한 간장 치킨' },
      { name: '순살 치킨', price: 20000, description: '순살 치킨' },
    ],
  },
];

export const sampleReviews: Review[] = [
  {
    id: '1',
    restaurantId: '1',
    author: '여행자 A',
    rating: 5,
    text: '정말 맛있었습니다! 강력 추천합니다.',
    date: '2024-01-20',
  },
  {
    id: '2',
    restaurantId: '1',
    author: '여행자 B',
    rating: 4,
    text: '좋은 음식과 친절한 서비스',
    date: '2024-01-19',
  },
  {
    id: '3',
    restaurantId: '2',
    author: '커피 애호가',
    rating: 5,
    text: '최고의 커피 로스터리!',
    date: '2024-01-18',
  },
];

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find(r => r.id === id);
}

export function getRestaurantsByCategory(category: string): Restaurant[] {
  return restaurants.filter(r => r.category === category);
}

export function searchRestaurants(query: string): Restaurant[] {
  const lowerQuery = query.toLowerCase();
  return restaurants.filter(r =>
    r.name.toLowerCase().includes(lowerQuery) ||
    r.description.toLowerCase().includes(lowerQuery)
  );
}

export function getReviewsByRestaurant(restaurantId: string): Review[] {
  return sampleReviews.filter(r => r.restaurantId === restaurantId);
}
