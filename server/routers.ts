import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as restaurantDb from "./restaurantDb";
import * as mealBuddyDb from "./mealBuddyDb";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(() => {
      // Client handles supabase.auth.signOut() directly.
      return { success: true } as const;
    }),
  }),

  restaurants: router({
    list: publicProcedure
      .input(
        z
          .object({
            price: z.enum(["cheap", "moderate", "expensive"]).optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        return await restaurantDb.getAllRestaurants(input?.price);
      }),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await restaurantDb.getRestaurantById(input.id);
      }),
    byCategory: publicProcedure
      .input(
        z.object({
          category: z.string(),
          price: z.enum(["cheap", "moderate", "expensive"]).optional(),
        })
      )
      .query(async ({ input }) => {
        return await restaurantDb.getRestaurantsByCategory(
          input.category,
          input.price
        );
      }),
    search: publicProcedure
      .input(
        z.object({
          query: z.string(),
          price: z.enum(["cheap", "moderate", "expensive"]).optional(),
        })
      )
      .query(async ({ input }) => {
        return await restaurantDb.searchRestaurants(input.query, input.price);
      }),
  }),

  menuItems: router({
    byRestaurant: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        return await restaurantDb.getMenuItemsByRestaurant(input.restaurantId);
      }),
  }),

  reviews: router({
    byRestaurant: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        return await restaurantDb.getReviewsByRestaurant(input.restaurantId);
      }),
    create: protectedProcedure
      .input(
        z.object({
          restaurantId: z.number(),
          rating: z.number().min(1).max(5),
          text: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await restaurantDb.createReview({
          restaurantId: input.restaurantId,
          userId: ctx.user.id,
          rating: input.rating,
          text: input.text || null,
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          reviewId: z.number(),
          rating: z.number().min(1).max(5),
          text: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await restaurantDb.updateReview(
          input.reviewId,
          ctx.user.id,
          input.text || "",
          input.rating
        );
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await restaurantDb.deleteReview(input.reviewId, ctx.user.id);
        return { success: true };
      }),
  }),

  bookmarks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await restaurantDb.getBookmarksByUser(ctx.user.id);
    }),
    isBookmarked: protectedProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await restaurantDb.isBookmarked(ctx.user.id, input.restaurantId);
      }),
    create: protectedProcedure
      .input(z.object({ restaurantId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await restaurantDb.createBookmark({
          userId: ctx.user.id,
          restaurantId: input.restaurantId,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ restaurantId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await restaurantDb.deleteBookmark(ctx.user.id, input.restaurantId);
        return { success: true };
      }),
  }),

  // ===== Meal Buddy =====
  mealBuddy: router({
    // Profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await mealBuddyDb.getUserProfile(ctx.user.id);
    }),
    updateProfile: protectedProcedure
      .input(
        z.object({
          displayName: z.string().min(1).max(100),
          nationality: z.string().max(64).optional(),
          preferredLanguage: z.string().max(10).optional(),
          foodPreferences: z.string().optional(),
          bio: z.string().optional(),
          profileImage: z.string().optional(),
          contactMethod: z.string().max(20).optional(),
          contactInfo: z.string().max(200).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await mealBuddyDb.upsertUserProfile({
          userId: ctx.user.id,
          ...input,
        });
      }),

    // Posts
    allPosts: publicProcedure.query(async () => {
      return await mealBuddyDb.getAllOpenPosts();
    }),
    postsByRestaurant: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        return await mealBuddyDb.getPostsByRestaurant(input.restaurantId);
      }),
    getPost: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await mealBuddyDb.getPostById(input.id);
      }),
    createPost: protectedProcedure
      .input(
        z.object({
          restaurantId: z.number(),
          title: z.string().min(1).max(200),
          description: z.string().optional(),
          diningDate: z.string().transform((s) => new Date(s)),
          maxCompanions: z.number().min(1).max(10).default(2),
          preferredLanguages: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await mealBuddyDb.createPost({
          ...input,
          creatorId: ctx.user.id,
          status: "open",
        });
      }),
    updatePostStatus: protectedProcedure
      .input(
        z.object({
          postId: z.number(),
          status: z.enum(["open", "full", "completed", "cancelled"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await mealBuddyDb.updatePostStatus(
          input.postId,
          ctx.user.id,
          input.status
        );
        return { success: true };
      }),
    myPosts: protectedProcedure.query(async ({ ctx }) => {
      return await mealBuddyDb.getMyPosts(ctx.user.id);
    }),

    // Responses
    responsesByPost: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return await mealBuddyDb.getResponsesByPost(input.postId);
      }),
    createResponse: protectedProcedure
      .input(
        z.object({
          postId: z.number(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await mealBuddyDb.createResponse({
          postId: input.postId,
          responderId: ctx.user.id,
          message: input.message,
          status: "pending",
        });
      }),
    handleResponse: protectedProcedure
      .input(
        z.object({
          responseId: z.number(),
          status: z.enum(["accepted", "declined"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await mealBuddyDb.updateResponseStatus(
          input.responseId,
          ctx.user.id,
          input.status
        );
      }),
    myResponses: protectedProcedure.query(async ({ ctx }) => {
      return await mealBuddyDb.getMyResponses(ctx.user.id);
    }),

    // Contact exchange
    getMatchedContact: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await mealBuddyDb.getMatchedContact(input.postId, ctx.user.id);
      }),

    // Messages
    getMessages: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await mealBuddyDb.getMessagesByPost(input.postId, ctx.user.id);
      }),
    sendMessage: protectedProcedure
      .input(
        z.object({
          postId: z.number(),
          content: z.string().min(1).max(2000),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await mealBuddyDb.createMessage({
          postId: input.postId,
          senderId: ctx.user.id,
          content: input.content,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
