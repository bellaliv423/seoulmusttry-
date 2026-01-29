import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    supabaseId: `test-supabase-${userId}`,
    email: `user${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "email",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("reviews", () => {
  it("should create a review for authenticated user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.create({
      restaurantId: 1,
      rating: 5,
      text: "Great food!",
    });

    expect(result).toBeDefined();
  });

  it("should fetch reviews by restaurant", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const reviews = await caller.reviews.byRestaurant({
      restaurantId: 1,
    });

    expect(Array.isArray(reviews)).toBe(true);
  });
});

describe("bookmarks", () => {
  it("should create a bookmark for authenticated user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bookmarks.create({
      restaurantId: 1,
    });

    expect(result).toBeDefined();
  });

  it("should fetch bookmarks for authenticated user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const bookmarks = await caller.bookmarks.list();

    expect(Array.isArray(bookmarks)).toBe(true);
  });

  it("should check if restaurant is bookmarked", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const isBookmarked = await caller.bookmarks.isBookmarked({
      restaurantId: 1,
    });

    expect(typeof isBookmarked).toBe("boolean");
  });
});

describe("restaurants", () => {
  it("should fetch all restaurants", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const restaurants = await caller.restaurants.list();

    expect(Array.isArray(restaurants)).toBe(true);
    expect(restaurants.length).toBeGreaterThan(0);
  });

  it("should fetch restaurant by id", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const restaurant = await caller.restaurants.byId({ id: 1 });

    expect(restaurant).toBeDefined();
    if (restaurant) {
      expect(restaurant.id).toBe(1);
    }
  });

  it("should fetch restaurants by category", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const restaurants = await caller.restaurants.byCategory({
      category: "korean",
    });

    expect(Array.isArray(restaurants)).toBe(true);
  });

  it("should search restaurants", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const restaurants = await caller.restaurants.search({
      query: "교자",
    });

    expect(Array.isArray(restaurants)).toBe(true);
  });
});
