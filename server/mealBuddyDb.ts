import { eq, and, desc, asc, gte } from "drizzle-orm";
import {
  userProfiles,
  mealBuddyPosts,
  mealBuddyResponses,
  mealBuddyMessages,
  users,
  restaurants,
  type InsertUserProfile,
  type InsertMealBuddyPost,
  type InsertMealBuddyResponse,
  type InsertMealBuddyMessage,
} from "../drizzle/schema";
import { getDb } from "./db";

// ===== USER PROFILES =====

export async function getUserProfile(userId: number) {
  const db = getDb();
  const rows = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertUserProfile(data: Omit<InsertUserProfile, "id" | "createdAt" | "updatedAt">) {
  const db = getDb();
  const existing = await getUserProfile(data.userId);
  if (existing) {
    await db
      .update(userProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userProfiles.userId, data.userId));
    return (await getUserProfile(data.userId))!;
  }
  const rows = await db.insert(userProfiles).values(data).returning();
  return rows[0];
}

// ===== MEAL BUDDY POSTS =====

export async function getPostsByRestaurant(restaurantId: number) {
  const db = getDb();
  return await db
    .select({
      post: mealBuddyPosts,
      creator: {
        id: users.id,
        name: users.name,
      },
      creatorProfile: {
        displayName: userProfiles.displayName,
        nationality: userProfiles.nationality,
        profileImage: userProfiles.profileImage,
      },
      restaurant: {
        id: restaurants.id,
        name: restaurants.name,
        nameEn: restaurants.nameEn,
      },
    })
    .from(mealBuddyPosts)
    .leftJoin(users, eq(mealBuddyPosts.creatorId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .leftJoin(restaurants, eq(mealBuddyPosts.restaurantId, restaurants.id))
    .where(
      and(
        eq(mealBuddyPosts.restaurantId, restaurantId),
        eq(mealBuddyPosts.status, "open"),
        gte(mealBuddyPosts.diningDate, new Date())
      )
    )
    .orderBy(asc(mealBuddyPosts.diningDate));
}

export async function getAllOpenPosts() {
  const db = getDb();
  return await db
    .select({
      post: mealBuddyPosts,
      creator: {
        id: users.id,
        name: users.name,
      },
      creatorProfile: {
        displayName: userProfiles.displayName,
        nationality: userProfiles.nationality,
        profileImage: userProfiles.profileImage,
      },
      restaurant: {
        id: restaurants.id,
        name: restaurants.name,
        nameEn: restaurants.nameEn,
        category: restaurants.category,
      },
    })
    .from(mealBuddyPosts)
    .leftJoin(users, eq(mealBuddyPosts.creatorId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .leftJoin(restaurants, eq(mealBuddyPosts.restaurantId, restaurants.id))
    .where(
      and(
        eq(mealBuddyPosts.status, "open"),
        gte(mealBuddyPosts.diningDate, new Date())
      )
    )
    .orderBy(asc(mealBuddyPosts.diningDate));
}

export async function getPostById(postId: number) {
  const db = getDb();
  const rows = await db
    .select({
      post: mealBuddyPosts,
      creator: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
      creatorProfile: {
        displayName: userProfiles.displayName,
        nationality: userProfiles.nationality,
        profileImage: userProfiles.profileImage,
        bio: userProfiles.bio,
      },
      restaurant: {
        id: restaurants.id,
        name: restaurants.name,
        nameEn: restaurants.nameEn,
        address: restaurants.address,
        category: restaurants.category,
      },
    })
    .from(mealBuddyPosts)
    .leftJoin(users, eq(mealBuddyPosts.creatorId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .leftJoin(restaurants, eq(mealBuddyPosts.restaurantId, restaurants.id))
    .where(eq(mealBuddyPosts.id, postId))
    .limit(1);
  return rows[0] ?? null;
}

export async function createPost(data: Omit<InsertMealBuddyPost, "id" | "createdAt" | "updatedAt" | "currentCompanions">) {
  const db = getDb();
  const rows = await db.insert(mealBuddyPosts).values(data).returning();
  return rows[0];
}

export async function updatePostStatus(postId: number, creatorId: number, status: "open" | "full" | "completed" | "cancelled") {
  const db = getDb();
  await db
    .update(mealBuddyPosts)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(mealBuddyPosts.id, postId), eq(mealBuddyPosts.creatorId, creatorId)));
}

export async function getMyPosts(userId: number) {
  const db = getDb();
  return await db
    .select({
      post: mealBuddyPosts,
      restaurant: {
        id: restaurants.id,
        name: restaurants.name,
        nameEn: restaurants.nameEn,
      },
    })
    .from(mealBuddyPosts)
    .leftJoin(restaurants, eq(mealBuddyPosts.restaurantId, restaurants.id))
    .where(eq(mealBuddyPosts.creatorId, userId))
    .orderBy(desc(mealBuddyPosts.createdAt));
}

// ===== RESPONSES =====

export async function getResponsesByPost(postId: number) {
  const db = getDb();
  return await db
    .select({
      response: mealBuddyResponses,
      responder: {
        id: users.id,
        name: users.name,
      },
      responderProfile: {
        displayName: userProfiles.displayName,
        nationality: userProfiles.nationality,
        profileImage: userProfiles.profileImage,
      },
    })
    .from(mealBuddyResponses)
    .leftJoin(users, eq(mealBuddyResponses.responderId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(eq(mealBuddyResponses.postId, postId))
    .orderBy(desc(mealBuddyResponses.createdAt));
}

export async function createResponse(data: Omit<InsertMealBuddyResponse, "id" | "createdAt" | "updatedAt">) {
  const db = getDb();
  const rows = await db.insert(mealBuddyResponses).values(data).returning();
  return rows[0];
}

export async function updateResponseStatus(
  responseId: number,
  postCreatorId: number,
  status: "accepted" | "declined"
) {
  const db = getDb();
  // Verify the post creator is the one updating
  const responseRows = await db
    .select()
    .from(mealBuddyResponses)
    .where(eq(mealBuddyResponses.id, responseId))
    .limit(1);
  const response = responseRows[0];
  if (!response) return null;

  const postRows = await db
    .select()
    .from(mealBuddyPosts)
    .where(eq(mealBuddyPosts.id, response.postId))
    .limit(1);
  const post = postRows[0];
  if (!post || post.creatorId !== postCreatorId) return null;

  await db
    .update(mealBuddyResponses)
    .set({ status, updatedAt: new Date() })
    .where(eq(mealBuddyResponses.id, responseId));

  // If accepted, increment companion count
  if (status === "accepted") {
    const newCount = post.currentCompanions + 1;
    const updates: Record<string, unknown> = {
      currentCompanions: newCount,
      updatedAt: new Date(),
    };
    if (newCount >= post.maxCompanions) {
      updates.status = "full";
    }
    await db
      .update(mealBuddyPosts)
      .set(updates)
      .where(eq(mealBuddyPosts.id, post.id));
  }

  return { success: true };
}

export async function getMyResponses(userId: number) {
  const db = getDb();
  return await db
    .select({
      response: mealBuddyResponses,
      post: mealBuddyPosts,
      restaurant: {
        id: restaurants.id,
        name: restaurants.name,
        nameEn: restaurants.nameEn,
      },
    })
    .from(mealBuddyResponses)
    .leftJoin(mealBuddyPosts, eq(mealBuddyResponses.postId, mealBuddyPosts.id))
    .leftJoin(restaurants, eq(mealBuddyPosts.restaurantId, restaurants.id))
    .where(eq(mealBuddyResponses.responderId, userId))
    .orderBy(desc(mealBuddyResponses.createdAt));
}

// ===== CONTACT EXCHANGE (only after accepted) =====

export async function getMatchedContact(postId: number, requesterId: number) {
  const db = getDb();
  // Must be creator or accepted responder
  const postRows = await db
    .select()
    .from(mealBuddyPosts)
    .where(eq(mealBuddyPosts.id, postId))
    .limit(1);
  const post = postRows[0];
  if (!post) return null;

  const isCreator = post.creatorId === requesterId;
  const isAccepted = await db
    .select()
    .from(mealBuddyResponses)
    .where(
      and(
        eq(mealBuddyResponses.postId, postId),
        eq(mealBuddyResponses.responderId, requesterId),
        eq(mealBuddyResponses.status, "accepted")
      )
    )
    .limit(1);

  if (!isCreator && isAccepted.length === 0) return null;

  // Return contact info for the other party
  const targetUserId = isCreator ? undefined : post.creatorId;
  if (isCreator) {
    // Return accepted responders' contacts
    const acceptedResponders = await db
      .select({
        displayName: userProfiles.displayName,
        contactMethod: userProfiles.contactMethod,
        contactInfo: userProfiles.contactInfo,
      })
      .from(mealBuddyResponses)
      .leftJoin(userProfiles, eq(mealBuddyResponses.responderId, userProfiles.userId))
      .where(
        and(
          eq(mealBuddyResponses.postId, postId),
          eq(mealBuddyResponses.status, "accepted")
        )
      );
    return acceptedResponders;
  } else {
    // Return creator's contact
    const creatorProfile = await db
      .select({
        displayName: userProfiles.displayName,
        contactMethod: userProfiles.contactMethod,
        contactInfo: userProfiles.contactInfo,
      })
      .from(userProfiles)
      .where(eq(userProfiles.userId, targetUserId!))
      .limit(1);
    return creatorProfile;
  }
}

// ===== MESSAGES =====

export async function getMessagesByPost(postId: number, userId: number) {
  const db = getDb();
  // Verify user is creator or accepted responder
  const postRows = await db
    .select()
    .from(mealBuddyPosts)
    .where(eq(mealBuddyPosts.id, postId))
    .limit(1);
  const post = postRows[0];
  if (!post) return [];

  const isCreator = post.creatorId === userId;
  if (!isCreator) {
    const accepted = await db
      .select()
      .from(mealBuddyResponses)
      .where(
        and(
          eq(mealBuddyResponses.postId, postId),
          eq(mealBuddyResponses.responderId, userId),
          eq(mealBuddyResponses.status, "accepted")
        )
      )
      .limit(1);
    if (accepted.length === 0) return [];
  }

  return await db
    .select({
      message: mealBuddyMessages,
      sender: {
        id: users.id,
        name: users.name,
      },
      senderProfile: {
        displayName: userProfiles.displayName,
        profileImage: userProfiles.profileImage,
      },
    })
    .from(mealBuddyMessages)
    .leftJoin(users, eq(mealBuddyMessages.senderId, users.id))
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(eq(mealBuddyMessages.postId, postId))
    .orderBy(asc(mealBuddyMessages.createdAt));
}

export async function createMessage(data: Omit<InsertMealBuddyMessage, "id" | "createdAt">) {
  const db = getDb();
  const rows = await db.insert(mealBuddyMessages).values(data).returning();
  return rows[0];
}
