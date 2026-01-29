/**
 * Seoul in a Bite - Real Restaurant Data Collector
 *
 * 한국문화정보원 API + SerpAPI (Google Maps) 통합 데이터 수집 스크립트
 *
 * 사용법:
 *   node collect-restaurant-data.mjs [옵션]
 *
 * 옵션:
 *   --dry-run            DB 저장 없이 시뮬레이션
 *   --category <name>    특정 KCISA 카테고리만 수집 (예: 한식, 분식, 치킨)
 *   --limit <N>          카테고리당 최대 수집 수 (기본: 100)
 *   --skip-serp          SerpAPI 보강 건너뛰기
 *   --serp-budget <N>    SerpAPI 최대 호출 수 (기본: 50)
 *   --update             기존 레코드 업데이트 허용
 *   --verbose            상세 로그 출력
 *
 * 환경변수 (.env):
 *   DATABASE_URL         PostgreSQL 연결 문자열 (필수)
 *   KCISA_API_KEY        한국문화정보원 API 키 (필수)
 *   SERPAPI_KEY           SerpAPI 키 (선택, --skip-serp 시 불필요)
 */

import postgres from "postgres";
import { config } from "dotenv";

config();

// ============================================================
// SECTION 1: CLI Argument Parsing
// ============================================================

function parseArgs() {
  const args = process.argv.slice(2);

  function getArgValue(flag, defaultVal) {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : defaultVal;
  }

  return {
    dryRun: args.includes("--dry-run"),
    skipSerp: args.includes("--skip-serp"),
    update: args.includes("--update"),
    verbose: args.includes("--verbose"),
    category: getArgValue("--category", ""),
    limit: parseInt(getArgValue("--limit", "100"), 10),
    serpBudget: parseInt(getArgValue("--serp-budget", "50"), 10),
  };
}

const opts = parseArgs();

// ============================================================
// SECTION 2: Constants & Mappings
// ============================================================

const KCISA_API_URL = "https://api.kcisa.kr/openapi/API_CNV_063/request";
const SERPAPI_URL = "https://serpapi.com/search.json";

// KCISA 카테고리 → DB category enum 매핑
const KCISA_CATEGORY_MAP = {
  "한식": "korean",
  "분식": "streetFood",
  "치킨": "chicken",
  "동양식": "noodles",
  "서양식": "korean",
  "패스트푸드": "streetFood",
  "뷔페": "korean",
  "퓨전": "korean",
};

// 전체 KCISA 카테고리 목록
const ALL_KCISA_CATEGORIES = ["한식", "분식", "치킨", "동양식", "서양식", "패스트푸드", "뷔페", "퓨전"];

// SerpAPI Google Maps types → DB category enum 세분화
function refineCategoryWithGoogleTypes(baseCategory, googleTypes) {
  if (!googleTypes || googleTypes.length === 0) return baseCategory;
  const types = googleTypes.map(t => t.toLowerCase());
  if (types.some(t => t.includes("cafe") || t.includes("coffee"))) return "cafe";
  if (types.some(t => t.includes("bakery") || t.includes("dessert") || t.includes("ice_cream"))) return "dessert";
  if (types.some(t => t.includes("seafood"))) return "seafood";
  if (types.some(t => t.includes("barbecue") || t.includes("bbq"))) return "bbq";
  if (types.some(t => t.includes("noodle") || t.includes("ramen"))) return "noodles";
  return baseCategory;
}

// SerpAPI 가격 → DB price enum 매핑
function mapPrice(priceStr) {
  if (!priceStr) return "moderate";
  const dollarCount = (String(priceStr).match(/\$/g) || []).length;
  if (dollarCount <= 1) return "cheap";
  if (dollarCount === 2) return "moderate";
  return "expensive";
}

// SerpAPI 평점 → DB rating (integer * 10)
function mapRating(rating) {
  if (!rating || rating === 0) return 0;
  return Math.round(parseFloat(rating) * 10);
}

// GPS 좌표 유효성 검사 (varchar로 저장)
function validateCoord(value, fallback) {
  if (!value) return fallback;
  const num = parseFloat(value);
  if (isNaN(num)) return fallback;
  return String(value);
}

// ============================================================
// SECTION 3: Rate Limiter
// ============================================================

class RateLimiter {
  constructor(name, minIntervalMs, maxCalls) {
    this.name = name;
    this.minIntervalMs = minIntervalMs;
    this.maxCalls = maxCalls;
    this.callCount = 0;
    this.lastCallTime = 0;
  }

  async wait() {
    if (this.maxCalls > 0 && this.callCount >= this.maxCalls) {
      throw new Error(`${this.name}: 호출 한도 도달 (${this.maxCalls}회)`);
    }
    const now = Date.now();
    const elapsed = now - this.lastCallTime;
    if (elapsed < this.minIntervalMs) {
      await sleep(this.minIntervalMs - elapsed);
    }
    this.callCount++;
    this.lastCallTime = Date.now();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const kcisaLimiter = new RateLimiter("KCISA", 150, 1000);
const serpLimiter = new RateLimiter("SerpAPI", 1200, 0); // maxCalls managed by budget

// ============================================================
// SECTION 4: HTTP Fetch with Retry
// ============================================================

async function apiFetch(baseUrl, params, timeoutMs = 30000) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      url.searchParams.set(key, String(val));
    }
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(baseUrl, params, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiFetch(baseUrl, params);
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      if (attempt === maxRetries) throw error;
      const delay = Math.pow(2, attempt) * 500;
      if (opts.verbose) {
        console.log(`    Retry ${attempt}/${maxRetries} in ${delay}ms: ${error.message}`);
      }
      await sleep(delay);
    }
  }
}

// ============================================================
// SECTION 5: KCISA API Client
// ============================================================

async function fetchKCISAPage(areaNm, clNm, pageNo, numOfRows) {
  await kcisaLimiter.wait();

  const data = await fetchWithRetry(KCISA_API_URL, {
    serviceKey: process.env.KCISA_API_KEY,
    numOfRows: String(numOfRows),
    pageNo: String(pageNo),
    areaNm,
    clNm: clNm || undefined,
  });

  // KCISA API 응답 검증
  const header = data?.response?.header;
  if (!header || header.resultCode !== "0000") {
    const msg = header?.resultMsg || "Unknown KCISA error";
    throw new Error(`KCISA API: ${msg} (code: ${header?.resultCode})`);
  }

  const items = data.response.body?.items?.item;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

// ============================================================
// SECTION 6: SerpAPI Client (Google Maps)
// ============================================================

async function searchGoogleMaps(query, latitude, longitude) {
  await serpLimiter.wait();

  const data = await fetchWithRetry(SERPAPI_URL, {
    engine: "google_maps",
    q: query,
    ll: `@${latitude},${longitude},16z`,
    type: "search",
    hl: "ko",
    api_key: process.env.SERPAPI_KEY,
  });

  return data?.local_results || [];
}

// ============================================================
// SECTION 7: Data Transformation
// ============================================================

function transformKCISAItem(raw) {
  const name = raw.rstrNm
    ? raw.rstrNm + (raw.rstrBhfNm ? ` ${raw.rstrBhfNm}` : "")
    : null;

  if (!name) return null;

  const address = raw.rstrRoadAddr || raw.rstrLnbrAddr || "";
  const latitude = validateCoord(raw.rstrLatPos, "37.5665");
  const longitude = validateCoord(raw.rstrLotPos, "126.9780");

  // 서울 범위 체크 (lat: 37.4-37.7, lng: 126.8-127.2)
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (lat < 37.4 || lat > 37.7 || lng < 126.8 || lng > 127.2) {
    if (opts.verbose) console.log(`    GPS 범위 밖 (서울 아님): ${name} (${lat}, ${lng})`);
    return null;
  }

  return {
    _existingId: null,
    name,
    nameEn: null,
    nameZhTw: null,
    nameZhCn: null,
    category: KCISA_CATEGORY_MAP[raw.rstrClNm] || "korean",
    address,
    addressEn: null,
    addressZhTw: null,
    addressZhCn: null,
    phone: null,
    rating: 0,
    reviewCount: 0,
    price: "moderate",
    hours: null,
    description: null,
    descriptionEn: null,
    descriptionZhTw: null,
    descriptionZhCn: null,
    image: null,
    latitude,
    longitude,
  };
}

function enrichWithSerpAPI(item, serpResult) {
  if (!serpResult) return;

  // English name (SerpAPI title이 라틴 문자를 포함하는 경우)
  if (serpResult.title && /[a-zA-Z]/.test(serpResult.title)) {
    item.nameEn = serpResult.title;
  }

  // Rating
  if (serpResult.rating) {
    item.rating = mapRating(serpResult.rating);
  }

  // Review count
  if (serpResult.reviews) {
    item.reviewCount = parseInt(serpResult.reviews, 10) || 0;
  }

  // Phone
  if (serpResult.phone) {
    item.phone = serpResult.phone.substring(0, 20);
  }

  // Hours
  if (serpResult.hours) {
    item.hours = serpResult.hours;
  } else if (serpResult.operating_hours) {
    // operating_hours는 요일별 객체일 수 있음
    try {
      if (typeof serpResult.operating_hours === "object") {
        const today = serpResult.operating_hours.monday || serpResult.operating_hours.tuesday;
        if (today) item.hours = today;
      }
    } catch { /* ignore */ }
  }

  // Image
  if (serpResult.thumbnail) {
    item.image = serpResult.thumbnail;
  }

  // Price
  if (serpResult.price) {
    item.price = mapPrice(serpResult.price);
  }

  // Address (English from SerpAPI)
  if (serpResult.address && /[a-zA-Z]/.test(serpResult.address)) {
    item.addressEn = serpResult.address;
  }

  // Category refinement from Google types
  if (serpResult.types || serpResult.type) {
    const types = serpResult.types || [serpResult.type];
    item.category = refineCategoryWithGoogleTypes(item.category, types);
  }

  // GPS 좌표 업데이트 (SerpAPI가 더 정확할 수 있음)
  if (serpResult.gps_coordinates) {
    const { latitude, longitude } = serpResult.gps_coordinates;
    if (latitude && longitude) {
      item.latitude = String(latitude);
      item.longitude = String(longitude);
    }
  }
}

// ============================================================
// SECTION 8: Duplicate Detection
// ============================================================

function normalizeForDedup(name) {
  return name
    .replace(/\s+/g, "")
    .replace(/[·\-()（）「」『』【】\[\]]/g, "")
    .toLowerCase();
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isDuplicateInDB(candidate, existingRows) {
  const candidateNorm = normalizeForDedup(candidate.name);
  const candidateLat = parseFloat(candidate.latitude);
  const candidateLng = parseFloat(candidate.longitude);

  for (const row of existingRows) {
    const rowNorm = normalizeForDedup(row.name);

    // 정확한 이름 매칭
    if (candidateNorm === rowNorm) return row.id;

    // 이름 포함 매칭 + GPS 근접성(200m)
    if (candidateNorm.includes(rowNorm) || rowNorm.includes(candidateNorm)) {
      const dist = haversineDistance(
        candidateLat, candidateLng,
        parseFloat(row.latitude), parseFloat(row.longitude)
      );
      if (dist < 0.2) return row.id;
    }
  }

  return null;
}

// SerpAPI 결과에서 최적 매칭 찾기
function findBestSerpMatch(item, serpResults) {
  if (!serpResults || serpResults.length === 0) return null;

  const itemNameNorm = normalizeForDedup(item.name);
  let bestMatch = null;
  let bestScore = 0;

  for (const result of serpResults) {
    let score = 0;
    const resultNameNorm = normalizeForDedup(result.title || "");

    // 이름 유사도
    if (resultNameNorm === itemNameNorm) {
      score += 10;
    } else if (resultNameNorm.includes(itemNameNorm) || itemNameNorm.includes(resultNameNorm)) {
      score += 5;
    }

    // GPS 근접성
    if (result.gps_coordinates) {
      const dist = haversineDistance(
        parseFloat(item.latitude), parseFloat(item.longitude),
        result.gps_coordinates.latitude, result.gps_coordinates.longitude
      );
      if (dist < 0.1) score += 8;
      else if (dist < 0.3) score += 4;
      else if (dist < 1.0) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = result;
    }
  }

  // 최소 점수 5 이상만 매칭
  return bestScore >= 5 ? bestMatch : null;
}

// ============================================================
// SECTION 9: Database Operations
// ============================================================

async function insertRestaurant(sql, item) {
  const [row] = await sql`
    INSERT INTO restaurants (
      name, name_en, name_zh_tw, name_zh_cn,
      category, address, address_en, address_zh_tw, address_zh_cn,
      phone, rating, review_count, price, hours,
      description, description_en, description_zh_tw, description_zh_cn,
      image, latitude, longitude
    ) VALUES (
      ${item.name}, ${item.nameEn}, ${item.nameZhTw}, ${item.nameZhCn},
      ${item.category}, ${item.address}, ${item.addressEn}, ${item.addressZhTw}, ${item.addressZhCn},
      ${item.phone}, ${item.rating}, ${item.reviewCount}, ${item.price}, ${item.hours},
      ${item.description}, ${item.descriptionEn}, ${item.descriptionZhTw}, ${item.descriptionZhCn},
      ${item.image}, ${item.latitude}, ${item.longitude}
    )
    RETURNING id
  `;
  return row.id;
}

async function updateRestaurant(sql, existingId, item) {
  await sql`
    UPDATE restaurants SET
      name_en = COALESCE(${item.nameEn}, name_en),
      name_zh_tw = COALESCE(${item.nameZhTw}, name_zh_tw),
      name_zh_cn = COALESCE(${item.nameZhCn}, name_zh_cn),
      category = ${item.category},
      address_en = COALESCE(${item.addressEn}, address_en),
      address_zh_tw = COALESCE(${item.addressZhTw}, address_zh_tw),
      address_zh_cn = COALESCE(${item.addressZhCn}, address_zh_cn),
      phone = COALESCE(${item.phone}, phone),
      rating = CASE WHEN ${item.rating} > 0 THEN ${item.rating} ELSE rating END,
      review_count = CASE WHEN ${item.reviewCount} > 0 THEN ${item.reviewCount} ELSE review_count END,
      price = ${item.price},
      hours = COALESCE(${item.hours}, hours),
      description = COALESCE(${item.description}, description),
      description_en = COALESCE(${item.descriptionEn}, description_en),
      description_zh_tw = COALESCE(${item.descriptionZhTw}, description_zh_tw),
      description_zh_cn = COALESCE(${item.descriptionZhCn}, description_zh_cn),
      image = COALESCE(${item.image}, image),
      updated_at = NOW()
    WHERE id = ${existingId}
  `;
}

// ============================================================
// SECTION 10: Main Orchestration
// ============================================================

async function main() {
  console.log("=".repeat(60));
  console.log("  Seoul in a Bite - Restaurant Data Collector");
  console.log("  한국문화정보원 API + SerpAPI (Google Maps)");
  console.log("=".repeat(60));
  console.log();

  if (opts.dryRun) console.log("[DRY RUN] DB 저장 없이 시뮬레이션 모드");
  if (opts.skipSerp) console.log("[SKIP-SERP] SerpAPI 보강 건너뜀");
  if (opts.update) console.log("[UPDATE] 기존 레코드 업데이트 허용");
  if (opts.category) console.log(`[CATEGORY] ${opts.category}만 수집`);
  console.log(`[LIMIT] 카테고리당 최대 ${opts.limit}개`);
  if (!opts.skipSerp) console.log(`[SERP-BUDGET] 최대 ${opts.serpBudget}회`);
  console.log();

  // 환경변수 검증
  if (!process.env.DATABASE_URL && !opts.dryRun) {
    console.error("DATABASE_URL 환경변수가 필요합니다. (.env 파일 확인)");
    process.exit(1);
  }
  if (!process.env.KCISA_API_KEY) {
    console.error("KCISA_API_KEY 환경변수가 필요합니다. (.env 파일 확인)");
    process.exit(1);
  }
  const hasSerpApi = !!process.env.SERPAPI_KEY && !opts.skipSerp;
  if (!opts.skipSerp && !process.env.SERPAPI_KEY) {
    console.warn("SERPAPI_KEY가 없습니다. --skip-serp 옵션으로 SerpAPI 없이 실행합니다.\n");
  }

  // DB 연결 (dry-run이 아닌 경우만)
  let sql = null;
  if (!opts.dryRun) {
    sql = postgres(process.env.DATABASE_URL);
  }

  const stats = {
    kcisaTotal: 0,
    kcisaFiltered: 0,
    duplicates: 0,
    serpEnriched: 0,
    serpCalls: 0,
    inserted: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  try {
    // --------------------------------------------------------
    // Phase 0: 기존 레스토랑 로드 (중복 검사용)
    // --------------------------------------------------------
    let existingRows = [];
    if (sql) {
      existingRows = await sql`SELECT id, name, address, latitude, longitude FROM restaurants`;
      console.log(`DB에서 기존 레스토랑 ${existingRows.length}개 로드 (중복 검사용)\n`);
    }

    // --------------------------------------------------------
    // Phase 1: KCISA API에서 데이터 수집
    // --------------------------------------------------------
    console.log("=".repeat(60));
    console.log("  1단계: 한국문화정보원 API 데이터 수집");
    console.log("=".repeat(60) + "\n");

    const categories = opts.category
      ? [opts.category]
      : ALL_KCISA_CATEGORIES;

    const collected = [];
    const seenNames = new Set();

    for (const cat of categories) {
      console.log(`[${cat}] 수집 시작...`);
      let page = 1;
      let hasMore = true;
      let catCount = 0;

      while (hasMore && catCount < opts.limit) {
        try {
          const remaining = opts.limit - catCount;
          const pageSize = Math.min(remaining, 100);
          const items = await fetchKCISAPage("서울", cat, page, pageSize);

          if (items.length === 0) {
            hasMore = false;
            break;
          }

          for (const raw of items) {
            const transformed = transformKCISAItem(raw);
            if (!transformed) {
              stats.kcisaFiltered++;
              continue;
            }

            // 이번 실행 내 중복 체크
            const norm = normalizeForDedup(transformed.name);
            if (seenNames.has(norm)) {
              stats.duplicates++;
              continue;
            }
            seenNames.add(norm);

            // DB 중복 체크
            const dupId = isDuplicateInDB(transformed, existingRows);
            if (dupId && !opts.update) {
              stats.duplicates++;
              if (opts.verbose) console.log(`    [SKIP] 중복: ${transformed.name} (id=${dupId})`);
              continue;
            }
            if (dupId && opts.update) {
              transformed._existingId = dupId;
            }

            collected.push(transformed);
            catCount++;

            if (opts.verbose) {
              console.log(`    + ${transformed.name} (${transformed.category})`);
            }
          }

          stats.kcisaTotal += items.length;
          page++;
          if (items.length < 100) hasMore = false;
        } catch (error) {
          console.error(`  [${cat}] API 오류: ${error.message}`);
          hasMore = false;
        }
      }

      console.log(`  [${cat}] ${catCount}개 수집 완료\n`);
    }

    console.log(`KCISA 수집 완료: 총 ${stats.kcisaTotal}개 응답, ${collected.length}개 유효, ${stats.duplicates}개 중복 제외\n`);

    // --------------------------------------------------------
    // Phase 2: SerpAPI 보강
    // --------------------------------------------------------
    if (hasSerpApi && collected.length > 0) {
      console.log("=".repeat(60));
      console.log("  2단계: SerpAPI (Google Maps) 데이터 보강");
      console.log("=".repeat(60) + "\n");

      let serpCallsUsed = 0;

      for (const item of collected) {
        if (serpCallsUsed >= opts.serpBudget) {
          console.log(`SerpAPI 예산 소진 (${serpCallsUsed}/${opts.serpBudget})\n`);
          break;
        }

        try {
          const query = `${item.name} ${item.address}`.substring(0, 100);
          if (opts.verbose) console.log(`  [SERP] 검색: "${query}"`);

          const results = await searchGoogleMaps(query, item.latitude, item.longitude);
          serpCallsUsed++;
          stats.serpCalls++;

          const match = findBestSerpMatch(item, results);
          if (match) {
            enrichWithSerpAPI(item, match);
            stats.serpEnriched++;
            if (opts.verbose) {
              console.log(`    매칭 성공: ${match.title} (rating: ${match.rating || "N/A"})`);
            }
          } else if (opts.verbose) {
            console.log(`    매칭 실패: 결과 ${results.length}개 중 유사 항목 없음`);
          }
        } catch (error) {
          console.warn(`  [SERP] "${item.name}" 실패: ${error.message}`);
        }
      }

      console.log(`SerpAPI 보강 완료: ${stats.serpCalls}회 호출, ${stats.serpEnriched}개 보강\n`);
    }

    // --------------------------------------------------------
    // Phase 3: DB 저장
    // --------------------------------------------------------
    console.log("=".repeat(60));
    console.log("  3단계: 데이터베이스 저장");
    console.log("=".repeat(60) + "\n");

    if (opts.dryRun) {
      console.log("[DRY RUN] 저장될 레스토랑 목록:\n");
      collected.forEach((item, i) => {
        const action = item._existingId ? "[UPDATE]" : "[INSERT]";
        console.log(`  ${i + 1}. ${action} ${item.name}`);
        console.log(`     카테고리: ${item.category} | 가격: ${item.price} | 평점: ${item.rating / 10 || "N/A"}`);
        console.log(`     주소: ${item.address}`);
        if (item.nameEn) console.log(`     EN: ${item.nameEn}`);
        if (item.phone) console.log(`     전화: ${item.phone}`);
        if (item.hours) console.log(`     영업시간: ${item.hours}`);
        if (item.image) console.log(`     이미지: ${item.image}`);
        console.log();
      });
    } else {
      for (const item of collected) {
        try {
          if (item._existingId) {
            await updateRestaurant(sql, item._existingId, item);
            stats.updated++;
            console.log(`  [UPDATE] ${item.name} (id=${item._existingId})`);
          } else {
            const newId = await insertRestaurant(sql, item);
            stats.inserted++;
            console.log(`  [INSERT] ${item.name} (id=${newId})`);
          }
        } catch (error) {
          stats.failed++;
          stats.errors.push({ name: item.name, error: error.message });
          console.error(`  [FAIL] ${item.name}: ${error.message}`);
        }
      }
    }

    // --------------------------------------------------------
    // Summary
    // --------------------------------------------------------
    console.log("\n" + "=".repeat(60));
    console.log("  수집 결과 요약");
    console.log("=".repeat(60));
    console.log(`  KCISA API 응답 총:    ${stats.kcisaTotal}개`);
    console.log(`  필터링 (범위 밖 등):  ${stats.kcisaFiltered}개`);
    console.log(`  중복 제외:            ${stats.duplicates}개`);
    console.log(`  유효 수집:            ${collected.length}개`);
    if (hasSerpApi) {
      console.log(`  SerpAPI 호출:         ${stats.serpCalls}회`);
      console.log(`  SerpAPI 보강 성공:    ${stats.serpEnriched}개`);
    }
    if (!opts.dryRun) {
      console.log(`  DB 신규 삽입:         ${stats.inserted}개`);
      console.log(`  DB 업데이트:          ${stats.updated}개`);
      console.log(`  DB 저장 실패:         ${stats.failed}개`);
    }
    if (stats.errors.length > 0) {
      console.log("\n  오류 목록:");
      stats.errors.forEach(e => console.log(`    - ${e.name}: ${e.error}`));
    }
    console.log("=".repeat(60) + "\n");

  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

// ============================================================
// EXECUTION
// ============================================================

main().catch(error => {
  console.error("\n[FATAL] 스크립트 실행 오류:", error.message);
  if (opts.verbose) console.error(error.stack);
  process.exit(1);
});
