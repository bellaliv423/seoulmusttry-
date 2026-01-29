-- Seoul in a Bite Sample Data
-- Run this after schema.sql to populate sample restaurants

-- ============================================
-- SAMPLE RESTAURANTS
-- ============================================

INSERT INTO restaurants (name_ko, name_zh_tw, name_en, category, address, latitude, longitude, phone, rating, review_count, price_range, business_hours, images) VALUES

-- Korean BBQ
('광장시장 육회골목', '廣藏市場生牛肉街', 'Gwangjang Market Yukhoe Alley', 'meat', '서울 종로구 창경궁로 88', 37.5701, 126.9998, '02-2267-0831', 4.5, 245, 2,
'{"monday": "09:00-22:00", "tuesday": "09:00-22:00", "wednesday": "09:00-22:00", "thursday": "09:00-22:00", "friday": "09:00-22:00", "saturday": "09:00-22:00", "sunday": "09:00-22:00"}',
ARRAY['https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800']),

('명동교자', '明洞餃子', 'Myeongdong Kyoja', 'noodles', '서울 중구 명동10길 29', 37.5636, 126.9853, '02-776-5348', 4.3, 892, 1,
'{"monday": "10:30-21:30", "tuesday": "10:30-21:30", "wednesday": "10:30-21:30", "thursday": "10:30-21:30", "friday": "10:30-21:30", "saturday": "10:30-21:30", "sunday": "10:30-21:30"}',
ARRAY['https://images.unsplash.com/photo-1552611052-33e04de081de?w=800']),

('진옥화할매원조닭한마리', '陳玉華奶奶元祖一隻雞', 'Jin Ok Hwa Halmae One Chicken', 'chicken', '서울 종로구 종로5가 265-22', 37.5709, 127.0058, '02-2275-9666', 4.6, 567, 2,
'{"monday": "10:30-01:00", "tuesday": "10:30-01:00", "wednesday": "10:30-01:00", "thursday": "10:30-01:00", "friday": "10:30-01:00", "saturday": "10:30-01:00", "sunday": "10:30-01:00"}',
ARRAY['https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800']),

('토속촌삼계탕', '土俗村蔘雞湯', 'Tosokchon Samgyetang', 'korean', '서울 종로구 자하문로5길 5', 37.5798, 126.9712, '02-737-7444', 4.4, 1203, 2,
'{"monday": "10:00-22:00", "tuesday": "10:00-22:00", "wednesday": "10:00-22:00", "thursday": "10:00-22:00", "friday": "10:00-22:00", "saturday": "10:00-22:00", "sunday": "10:00-22:00"}',
ARRAY['https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800']),

('황생가칼국수', '黃生家刀削麵', 'Hwang Saeng Ga Kalguksu', 'noodles', '서울 중구 명동8나길 6', 37.5622, 126.9862, '02-776-1110', 4.2, 421, 1,
'{"monday": "10:00-21:00", "tuesday": "10:00-21:00", "wednesday": "10:00-21:00", "thursday": "10:00-21:00", "friday": "10:00-21:00", "saturday": "10:00-21:00", "sunday": "closed"}',
ARRAY['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800']),

-- Street Food
('남대문시장 호떡', '南大門市場糖餅', 'Namdaemun Market Hotteok', 'street_food', '서울 중구 남대문시장4길 42', 37.5593, 126.9775, NULL, 4.7, 892, 1,
'{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-18:00", "saturday": "08:00-18:00", "sunday": "closed"}',
ARRAY['https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800']),

('마포갈매기', '麻浦鷗', 'Mapo Galmaegi', 'meat', '서울 마포구 마포대로 186', 37.5523, 126.9543, '02-3275-1355', 4.5, 678, 2,
'{"monday": "11:30-23:00", "tuesday": "11:30-23:00", "wednesday": "11:30-23:00", "thursday": "11:30-23:00", "friday": "11:30-23:00", "saturday": "11:30-23:00", "sunday": "11:30-23:00"}',
ARRAY['https://images.unsplash.com/photo-1544025162-d76694265947?w=800']),

('신당동떡볶이타운', '新堂洞辣炒年糕街', 'Sindang-dong Tteokbokki Town', 'street_food', '서울 중구 다산로 33길', 37.5648, 127.0103, NULL, 4.3, 543, 1,
'{"monday": "11:00-22:00", "tuesday": "11:00-22:00", "wednesday": "11:00-22:00", "thursday": "11:00-22:00", "friday": "11:00-22:00", "saturday": "11:00-22:00", "sunday": "11:00-22:00"}',
ARRAY['https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800']),

-- Cafes
('블루보틀 삼청', '藍瓶咖啡三清店', 'Blue Bottle Samcheong', 'cafe', '서울 종로구 삼청로 76', 37.5819, 126.9838, '02-3210-0107', 4.4, 892, 2,
'{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "08:00-20:00", "sunday": "08:00-20:00"}',
ARRAY['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800']),

('오니온 성수', '洋蔥咖啡聖水店', 'Onion Seongsu', 'cafe', '서울 성동구 아차산로9길 8', 37.5449, 127.0555, '02-1234-5678', 4.6, 1567, 2,
'{"monday": "08:00-22:00", "tuesday": "08:00-22:00", "wednesday": "08:00-22:00", "thursday": "08:00-22:00", "friday": "08:00-22:00", "saturday": "09:00-22:00", "sunday": "09:00-22:00"}',
ARRAY['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800']),

('카페드파리', '巴黎咖啡館', 'Cafe de Paris', 'dessert', '서울 강남구 강남대로 452', 37.5017, 127.0263, '02-556-8282', 4.3, 432, 2,
'{"monday": "10:00-22:00", "tuesday": "10:00-22:00", "wednesday": "10:00-22:00", "thursday": "10:00-22:00", "friday": "10:00-23:00", "saturday": "10:00-23:00", "sunday": "10:00-22:00"}',
ARRAY['https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800']),

-- Seafood
('노량진수산시장', '鷺梁津水產市場', 'Noryangjin Fish Market', 'seafood', '서울 동작구 노량진로 674', 37.5128, 126.9402, '02-814-2211', 4.5, 2341, 2,
'{"monday": "03:00-23:00", "tuesday": "03:00-23:00", "wednesday": "03:00-23:00", "thursday": "03:00-23:00", "friday": "03:00-23:00", "saturday": "03:00-23:00", "sunday": "03:00-23:00"}',
ARRAY['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800']),

('어복쟁반', '魚福大盤', 'Eobok Jaengban', 'seafood', '서울 마포구 동교로 266', 37.5571, 126.9231, '02-332-2876', 4.4, 567, 3,
'{"monday": "17:00-02:00", "tuesday": "17:00-02:00", "wednesday": "17:00-02:00", "thursday": "17:00-02:00", "friday": "17:00-02:00", "saturday": "17:00-02:00", "sunday": "17:00-24:00"}',
ARRAY['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800']),

-- More Korean
('백년옥', '百年屋', 'Baeknyeonok', 'korean', '서울 중구 서소문로 139', 37.5636, 126.9717, '02-779-1010', 4.5, 765, 2,
'{"monday": "11:30-21:30", "tuesday": "11:30-21:30", "wednesday": "11:30-21:30", "thursday": "11:30-21:30", "friday": "11:30-21:30", "saturday": "11:30-21:00", "sunday": "11:30-21:00"}',
ARRAY['https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800']),

('북촌손만두', '北村手工餃子', 'Bukchon Son Mandu', 'korean', '서울 종로구 북촌로 10길 5', 37.5826, 126.9836, '02-732-4545', 4.2, 321, 1,
'{"monday": "10:00-20:00", "tuesday": "10:00-20:00", "wednesday": "10:00-20:00", "thursday": "10:00-20:00", "friday": "10:00-20:00", "saturday": "10:00-20:00", "sunday": "10:00-20:00"}',
ARRAY['https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800']),

-- Chicken
('교촌치킨 홍대점', '校村炸雞弘大店', 'Kyochon Chicken Hongdae', 'chicken', '서울 마포구 양화로 165', 37.5562, 126.9236, '02-323-9292', 4.3, 445, 2,
'{"monday": "11:00-03:00", "tuesday": "11:00-03:00", "wednesday": "11:00-03:00", "thursday": "11:00-03:00", "friday": "11:00-04:00", "saturday": "11:00-04:00", "sunday": "11:00-03:00"}',
ARRAY['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800']),

('BBQ치킨', 'BBQ炸雞', 'BBQ Chicken', 'chicken', '서울 강남구 테헤란로 151', 37.5008, 127.0370, '02-555-9292', 4.2, 678, 2,
'{"monday": "11:00-02:00", "tuesday": "11:00-02:00", "wednesday": "11:00-02:00", "thursday": "11:00-02:00", "friday": "11:00-02:00", "saturday": "11:00-02:00", "sunday": "11:00-02:00"}',
ARRAY['https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800']),

-- Dessert
('설빙 명동점', '雪冰明洞店', 'Sulbing Myeongdong', 'dessert', '서울 중구 명동길 74', 37.5637, 126.9846, '02-776-5522', 4.5, 1234, 2,
'{"monday": "10:00-23:00", "tuesday": "10:00-23:00", "wednesday": "10:00-23:00", "thursday": "10:00-23:00", "friday": "10:00-24:00", "saturday": "10:00-24:00", "sunday": "10:00-23:00"}',
ARRAY['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800']),

('도레도레', '多樂多樂', 'Dore Dore', 'dessert', '서울 마포구 와우산로 29라길 16', 37.5563, 126.9236, '02-322-7880', 4.4, 567, 2,
'{"monday": "12:00-22:00", "tuesday": "12:00-22:00", "wednesday": "12:00-22:00", "thursday": "12:00-22:00", "friday": "12:00-23:00", "saturday": "12:00-23:00", "sunday": "12:00-22:00"}',
ARRAY['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800']),

-- More street food
('익선동 쌀국수', '益善洞米線', 'Ikseon-dong Rice Noodles', 'noodles', '서울 종로구 익선동 33-5', 37.5739, 126.9877, '02-765-3365', 4.3, 432, 1,
'{"monday": "11:00-21:00", "tuesday": "11:00-21:00", "wednesday": "11:00-21:00", "thursday": "11:00-21:00", "friday": "11:00-21:00", "saturday": "11:00-21:00", "sunday": "11:00-21:00"}',
ARRAY['https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800']);

-- ============================================
-- SAMPLE MENUS
-- ============================================

-- Get first restaurant ID for sample menus
DO $$
DECLARE
  rest_id UUID;
BEGIN
  -- Gwangjang Market
  SELECT id INTO rest_id FROM restaurants WHERE name_en = 'Gwangjang Market Yukhoe Alley' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    INSERT INTO menus (restaurant_id, name_ko, name_zh_tw, name_en, description_zh_tw, price, is_popular) VALUES
    (rest_id, '육회', '生牛肉', 'Yukhoe (Korean Beef Tartare)', '新鮮生牛肉配梨子和蛋黃', 18000, true),
    (rest_id, '육회비빔밥', '生牛肉拌飯', 'Yukhoe Bibimbap', '生牛肉拌飯配各種蔬菜', 12000, true),
    (rest_id, '빈대떡', '綠豆煎餅', 'Bindaetteok (Mung Bean Pancake)', '酥脆綠豆煎餅', 8000, false);
  END IF;

  -- Myeongdong Kyoja
  SELECT id INTO rest_id FROM restaurants WHERE name_en = 'Myeongdong Kyoja' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    INSERT INTO menus (restaurant_id, name_ko, name_zh_tw, name_en, description_zh_tw, price, is_popular) VALUES
    (rest_id, '칼국수', '刀削麵', 'Kalguksu', '手工刀削麵配清湯', 10000, true),
    (rest_id, '만두', '餃子', 'Mandu (Dumplings)', '手工肉餃子', 10000, true),
    (rest_id, '비빔국수', '拌麵', 'Bibim Guksu', '辣拌冷麵', 10000, false),
    (rest_id, '콩국수', '豆漿麵', 'Kongguksu', '冷豆漿麵（夏季限定）', 11000, false);
  END IF;

  -- Tosokchon Samgyetang
  SELECT id INTO rest_id FROM restaurants WHERE name_en = 'Tosokchon Samgyetang' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    INSERT INTO menus (restaurant_id, name_ko, name_zh_tw, name_en, description_zh_tw, price, is_popular) VALUES
    (rest_id, '삼계탕', '蔘雞湯', 'Samgyetang', '人蔘雞湯，整隻雞配糯米', 17000, true),
    (rest_id, '한방삼계탕', '韓方蔘雞湯', 'Herbal Samgyetang', '加強版人蔘雞湯，更多藥材', 20000, true),
    (rest_id, '전복삼계탕', '鮑魚蔘雞湯', 'Abalone Samgyetang', '人蔘雞湯加鮑魚', 25000, false);
  END IF;

  -- Blue Bottle Samcheong
  SELECT id INTO rest_id FROM restaurants WHERE name_en = 'Blue Bottle Samcheong' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    INSERT INTO menus (restaurant_id, name_ko, name_zh_tw, name_en, description_zh_tw, price, is_popular) VALUES
    (rest_id, '뉴올리언스', '新奧爾良冰咖啡', 'New Orleans Iced', '加入菊苣和牛奶的冰咖啡', 6500, true),
    (rest_id, '카페라떼', '拿鐵', 'Cafe Latte', '濃縮咖啡加蒸奶', 5500, true),
    (rest_id, '드립커피', '手沖咖啡', 'Single Origin Drip', '單品手沖咖啡', 6000, false),
    (rest_id, '와플', '鬆餅', 'Liege Waffle', '比利時列日鬆餅', 4500, false);
  END IF;
END $$;

-- Add confirmation message
SELECT 'Sample data inserted successfully!' as status;
