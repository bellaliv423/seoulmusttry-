import axios from "axios";

/**
 * 한국문화정보원 API - 전국 시티투어 코스와 함께하는 맛집 정보
 * https://api.kcisa.kr/openapi/API_CNV_063/request
 */

export interface KCISARestaurant {
  title: string; // 시티투어 명
  description: string; // 시티투어 운행정보
  rstrNm: string; // 맛집 식당명
  rstrBhfNm: string; // 맛집 지점명
  rstrClNm: string; // 맛집 분류명 (한식/분식/치킨/동양식/서양식/패스트푸드/뷔페/퓨전)
  rstrRoadAddr: string; // 도로명 주소
  rstrLnbrAddr: string; // 지번 주소
  rstrLatPos: string; // 위도
  rstrLotPos: string; // 경도
  rstrInfoStdDt: string; // 정보 업데이트 일자
}

export interface KCISAResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: KCISARestaurant[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

/**
 * 한국문화정보원 API에서 맛집 데이터 가져오기
 */
export async function fetchKCISARestaurants(
  serviceKey: string,
  areaNm: string = "서울",
  clNm: string = "", // 빈 문자열이면 전체 카테고리
  pageNo: number = 1,
  numOfRows: number = 100
): Promise<KCISARestaurant[]> {
  try {
    const url = "https://api.kcisa.kr/openapi/API_CNV_063/request";
    const params = {
      serviceKey,
      numOfRows: numOfRows.toString(),
      pageNo: pageNo.toString(),
      areaNm,
      clNm,
    };

    const response = await axios.get<KCISAResponse>(url, {
      params,
      timeout: 30000,
    });

    if (response.data.response.header.resultCode !== "0000") {
      throw new Error(
        `KCISA API Error: ${response.data.response.header.resultMsg}`
      );
    }

    const items = response.data.response.body.items?.item || [];
    return Array.isArray(items) ? items : [items];
  } catch (error) {
    console.error("[KCISA API] Error fetching restaurants:", error);
    throw error;
  }
}

/**
 * SerpAPI - Google Maps 장소 검색
 * https://serpapi.com/maps-local-results
 */

export interface SerpAPIPlace {
  position: number;
  title: string;
  place_id: string;
  data_id: string;
  data_cid: string;
  reviews_link: string;
  photos_link: string;
  gps_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_id_search: string;
  provider_id: string;
  rating: number;
  reviews: number;
  type: string;
  types: string[];
  type_id: string;
  type_ids: string[];
  address: string;
  open_state: string;
  hours: string;
  operating_hours: {
    [key: string]: string;
  };
  phone: string;
  website: string;
  description: string;
  service_options: {
    [key: string]: boolean;
  };
  thumbnail: string;
}

export interface SerpAPIResponse {
  search_metadata: {
    id: string;
    status: string;
    created_at: string;
    processed_at: string;
    total_time_taken: number;
  };
  search_parameters: {
    engine: string;
    q: string;
    ll: string;
    type: string;
  };
  search_information: {
    local_results_state: string;
    query_displayed: string;
  };
  local_results: SerpAPIPlace[];
}

/**
 * SerpAPI로 Google Maps 장소 검색
 */
export async function searchGoogleMapsPlaces(
  apiKey: string,
  query: string,
  latitude: number,
  longitude: number,
  zoom: number = 14
): Promise<SerpAPIPlace[]> {
  try {
    const url = "https://serpapi.com/search.json";
    const params = {
      engine: "google_maps",
      q: query,
      ll: `@${latitude},${longitude},${zoom}z`,
      type: "search",
      api_key: apiKey,
    };

    const response = await axios.get<SerpAPIResponse>(url, {
      params,
      timeout: 30000,
    });

    return response.data.local_results || [];
  } catch (error) {
    console.error("[SerpAPI] Error searching places:", error);
    throw error;
  }
}

/**
 * SerpAPI - Google Maps 장소 상세 정보
 * https://serpapi.com/maps-place-results
 */

export interface SerpAPIPlaceDetails {
  search_metadata: {
    id: string;
    status: string;
  };
  place_results: {
    title: string;
    data_id: string;
    data_cid: string;
    gps_coordinates: {
      latitude: number;
      longitude: number;
    };
    rating: number;
    reviews: number;
    type: string;
    types: string[];
    address: string;
    open_state: string;
    hours: string;
    operating_hours: {
      [key: string]: string;
    };
    phone: string;
    website: string;
    description: string;
    service_options: {
      [key: string]: boolean;
    };
    reviews_per_score: {
      [key: string]: number;
    };
    user_reviews: {
      summary: {
        rating: number;
        text: string;
      }[];
    };
    popular_times: {
      [key: string]: {
        [key: string]: number;
      };
    };
    images: {
      thumbnail: string;
      original: string;
    }[];
  };
}

/**
 * SerpAPI로 Google Maps 장소 상세 정보 가져오기
 */
export async function getGoogleMapsPlaceDetails(
  apiKey: string,
  dataId: string
): Promise<SerpAPIPlaceDetails["place_results"] | null> {
  try {
    const url = "https://serpapi.com/search.json";
    const params = {
      engine: "google_maps",
      type: "place",
      data: dataId,
      api_key: apiKey,
    };

    const response = await axios.get<SerpAPIPlaceDetails>(url, {
      params,
      timeout: 30000,
    });

    return response.data.place_results || null;
  } catch (error) {
    console.error("[SerpAPI] Error fetching place details:", error);
    return null;
  }
}

/**
 * 카테고리 매핑 (한국문화정보원 -> 내부 카테고리)
 */
export function mapKCISACategoryToInternal(kcisaCategory: string): string {
  const categoryMap: { [key: string]: string } = {
    한식: "korean",
    분식: "streetFood",
    치킨: "chicken",
    동양식: "korean", // 일본, 중국 등 동양식을 한식으로 매핑
    서양식: "cafe", // 서양식을 카페로 매핑
    패스트푸드: "streetFood",
    뷔페: "bbq", // 뷔페를 BBQ로 매핑
    퓨전: "cafe",
  };

  return categoryMap[kcisaCategory] || "korean";
}

/**
 * Google Maps 타입을 내부 카테고리로 매핑
 */
export function mapGoogleMapsTypeToInternal(types: string[]): string {
  // 우선순위 순서로 매핑
  if (types.includes("cafe") || types.includes("coffee_shop")) return "cafe";
  if (types.includes("bakery")) return "dessert";
  if (types.includes("bar")) return "cafe";
  if (types.includes("restaurant")) {
    // 레스토랑 타입이면 추가 타입 확인
    if (types.includes("korean_restaurant")) return "korean";
    if (types.includes("japanese_restaurant")) return "korean";
    if (types.includes("chinese_restaurant")) return "korean";
    if (types.includes("seafood_restaurant")) return "seafood";
    if (types.includes("barbecue_restaurant")) return "bbq";
    return "korean"; // 기본값
  }
  if (types.includes("meal_takeaway")) return "streetFood";
  if (types.includes("food")) return "korean";

  return "korean"; // 기본값
}
