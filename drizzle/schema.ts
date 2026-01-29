import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// ===== ENUMS =====

export const roleEnum = pgEnum("role_enum", ["user", "admin"]);

export const categoryEnum = pgEnum("category_enum", [
  "korean",
  "cafe",
  "streetFood",
  "bbq",
  "seafood",
  "dessert",
  "noodles",
  "chicken",
]);

export const priceEnum = pgEnum("price_enum", ["cheap", "moderate", "expensive"]);

export const mealBuddyStatusEnum = pgEnum("meal_buddy_status_enum", [
  "open",
  "full",
  "completed",
  "cancelled",
]);

export const mealBuddyResponseStatusEnum = pgEnum("meal_buddy_response_status_enum", [
  "pending",
  "accepted",
  "declined",
  "cancelled",
]);

// ===== CORE TABLES =====

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  supabaseId: varchar("supabase_id", { length: 128 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  nameZhTw: text("name_zh_tw"),
  nameZhCn: text("name_zh_cn"),
  category: categoryEnum("category").notNull(),
  address: text("address").notNull(),
  addressEn: text("address_en"),
  addressZhTw: text("address_zh_tw"),
  addressZhCn: text("address_zh_cn"),
  phone: varchar("phone", { length: 20 }),
  rating: integer("rating").default(0).notNull(), // Average rating * 10 (e.g., 4.5 = 45)
  reviewCount: integer("review_count").default(0).notNull(),
  price: priceEnum("price").notNull(),
  hours: text("hours"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionZhTw: text("description_zh_tw"),
  descriptionZhCn: text("description_zh_cn"),
  image: text("image"),
  latitude: varchar("latitude", { length: 20 }).notNull(),
  longitude: varchar("longitude", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = typeof restaurants.$inferInsert;

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  nameZhTw: text("name_zh_tw"),
  nameZhCn: text("name_zh_cn"),
  price: integer("price").notNull(),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionZhTw: text("description_zh_tw"),
  descriptionZhCn: text("description_zh_cn"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(), // 1-5
  text: text("text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  restaurantId: integer("restaurant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = typeof bookmarks.$inferInsert;

// ===== MEAL BUDDY TABLES =====

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  nationality: varchar("nationality", { length: 64 }),
  preferredLanguage: varchar("preferred_language", { length: 10 }),
  foodPreferences: text("food_preferences"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  contactMethod: varchar("contact_method", { length: 20 }),
  contactInfo: varchar("contact_info", { length: 200 }),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

export const mealBuddyPosts = pgTable("meal_buddy_posts", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  creatorId: integer("creator_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  diningDate: timestamp("dining_date").notNull(),
  maxCompanions: integer("max_companions").notNull().default(2),
  currentCompanions: integer("current_companions").notNull().default(0),
  preferredLanguages: text("preferred_languages"), // JSON array: ["ko", "en"]
  status: mealBuddyStatusEnum("status").default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MealBuddyPost = typeof mealBuddyPosts.$inferSelect;
export type InsertMealBuddyPost = typeof mealBuddyPosts.$inferInsert;

export const mealBuddyResponses = pgTable("meal_buddy_responses", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  responderId: integer("responder_id").notNull(),
  message: text("message"),
  status: mealBuddyResponseStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MealBuddyResponse = typeof mealBuddyResponses.$inferSelect;
export type InsertMealBuddyResponse = typeof mealBuddyResponses.$inferInsert;

// ===== MEAL BUDDY MESSAGES =====

export const mealBuddyMessages = pgTable("meal_buddy_messages", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  senderId: integer("sender_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MealBuddyMessage = typeof mealBuddyMessages.$inferSelect;
export type InsertMealBuddyMessage = typeof mealBuddyMessages.$inferInsert;
