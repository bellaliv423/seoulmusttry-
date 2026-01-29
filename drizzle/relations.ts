import { relations } from "drizzle-orm";
import {
  users,
  restaurants,
  menuItems,
  reviews,
  bookmarks,
  userProfiles,
  mealBuddyPosts,
  mealBuddyResponses,
  mealBuddyMessages,
} from "./schema";

export const usersRelations = relations(users, ({ many, one }) => ({
  reviews: many(reviews),
  bookmarks: many(bookmarks),
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  mealBuddyPosts: many(mealBuddyPosts),
  mealBuddyResponses: many(mealBuddyResponses),
  mealBuddyMessages: many(mealBuddyMessages),
}));

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  menuItems: many(menuItems),
  reviews: many(reviews),
  bookmarks: many(bookmarks),
  mealBuddyPosts: many(mealBuddyPosts),
}));

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [menuItems.restaurantId],
    references: [restaurants.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [reviews.restaurantId],
    references: [restaurants.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  restaurant: one(restaurants, {
    fields: [bookmarks.restaurantId],
    references: [restaurants.id],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const mealBuddyPostsRelations = relations(mealBuddyPosts, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [mealBuddyPosts.restaurantId],
    references: [restaurants.id],
  }),
  creator: one(users, {
    fields: [mealBuddyPosts.creatorId],
    references: [users.id],
  }),
  responses: many(mealBuddyResponses),
  messages: many(mealBuddyMessages),
}));

export const mealBuddyResponsesRelations = relations(mealBuddyResponses, ({ one }) => ({
  post: one(mealBuddyPosts, {
    fields: [mealBuddyResponses.postId],
    references: [mealBuddyPosts.id],
  }),
  responder: one(users, {
    fields: [mealBuddyResponses.responderId],
    references: [users.id],
  }),
}));

export const mealBuddyMessagesRelations = relations(mealBuddyMessages, ({ one }) => ({
  post: one(mealBuddyPosts, {
    fields: [mealBuddyMessages.postId],
    references: [mealBuddyPosts.id],
  }),
  sender: one(users, {
    fields: [mealBuddyMessages.senderId],
    references: [users.id],
  }),
}));
