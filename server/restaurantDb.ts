import { eq, desc, and, sql, ilike, or } from "drizzle-orm";
import { getDb } from "./db";
import {
  restaurants,
  menuItems,
  reviews,
  bookmarks,
  InsertRestaurant,
  InsertMenuItem,
  InsertReview,
  InsertBookmark,
} from "../drizzle/schema";

// Restaurant queries
export async function getAllRestaurants(
  price?: "cheap" | "moderate" | "expensive"
) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(restaurants);

  if (price) {
    // @ts-ignore
    return await query.where(eq(restaurants.price, price)).orderBy(desc(restaurants.rating));
  }

  return await query.orderBy(desc(restaurants.rating));
}

export async function getRestaurantById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, id))
    .limit(1);
  return result[0];
}

export async function getRestaurantsByCategory(
  category: string,
  price?: "cheap" | "moderate" | "expensive"
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(restaurants.category, category as any)];
  if (price) {
    conditions.push(eq(restaurants.price, price));
  }

  return await db
    .select()
    .from(restaurants)
    .where(and(...conditions))
    .orderBy(desc(restaurants.rating));
}

export async function searchRestaurants(
  query: string,
  price?: "cheap" | "moderate" | "expensive"
) {
  const db = await getDb();
  if (!db) return [];

  const searchCondition = or(
    ilike(restaurants.name, `%${query}%`),
    ilike(restaurants.description, `%${query}%`),
    ilike(restaurants.nameEn, `%${query}%`),
    ilike(restaurants.nameZhTw, `%${query}%`),
    ilike(restaurants.nameZhCn, `%${query}%`)
  );

  const conditions = [searchCondition];
  if (price) {
    conditions.push(eq(restaurants.price, price));
  }

  return await db
    .select()
    .from(restaurants)
    .where(and(...conditions))
    .orderBy(desc(restaurants.rating));
}

export async function createRestaurant(data: InsertRestaurant) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(restaurants).values(data);
  return result;
}

export async function updateRestaurantRating(restaurantId: number) {
  const db = await getDb();
  if (!db) return;

  const reviewsData = await db
    .select()
    .from(reviews)
    .where(eq(reviews.restaurantId, restaurantId));

  if (reviewsData.length === 0) {
    await db
      .update(restaurants)
      .set({ rating: 0, reviewCount: 0, updatedAt: new Date() })
      .where(eq(restaurants.id, restaurantId));
    return;
  }

  const avgRating = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
  const ratingTimes10 = Math.round(avgRating * 10);

  await db
    .update(restaurants)
    .set({ rating: ratingTimes10, reviewCount: reviewsData.length, updatedAt: new Date() })
    .where(eq(restaurants.id, restaurantId));
}

// Menu item queries
export async function getMenuItemsByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId));
}

export async function createMenuItem(data: InsertMenuItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(menuItems).values(data);
}

// Review queries
export async function getReviewsByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.restaurantId, restaurantId))
    .orderBy(desc(reviews.createdAt));
}

export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reviews).values(data);

  await updateRestaurantRating(data.restaurantId);

  return result;
}

export async function updateReview(reviewId: number, userId: number, text: string, rating: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const review = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
  if (!review[0] || review[0].userId !== userId) {
    throw new Error("Unauthorized");
  }

  await db
    .update(reviews)
    .set({ text, rating, updatedAt: new Date() })
    .where(eq(reviews.id, reviewId));

  await updateRestaurantRating(review[0].restaurantId);
}

export async function deleteReview(reviewId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const review = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
  if (!review[0] || review[0].userId !== userId) {
    throw new Error("Unauthorized");
  }

  const restaurantId = review[0].restaurantId;
  await db.delete(reviews).where(eq(reviews.id, reviewId));

  await updateRestaurantRating(restaurantId);
}

// Bookmark queries
export async function getBookmarksByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
}

export async function isBookmarked(userId: number, restaurantId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.restaurantId, restaurantId)))
    .limit(1);
  return result.length > 0;
}

export async function createBookmark(data: InsertBookmark) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(bookmarks).values(data);
}

export async function deleteBookmark(userId: number, restaurantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.restaurantId, restaurantId)));
}
