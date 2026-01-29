import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { supabaseAdmin } from "./supabase";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const authHeader = opts.req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const {
        data: { user: supabaseUser },
        error,
      } = await supabaseAdmin.auth.getUser(token);

      if (supabaseUser && !error) {
        let dbUser = await db.getUserBySupabaseId(supabaseUser.id);
        if (!dbUser) {
          await db.upsertUser({
            supabaseId: supabaseUser.id,
            name:
              supabaseUser.user_metadata?.full_name ||
              supabaseUser.email?.split("@")[0] ||
              null,
            email: supabaseUser.email ?? null,
            loginMethod: supabaseUser.app_metadata?.provider ?? null,
            lastSignedIn: new Date(),
          });
          dbUser = await db.getUserBySupabaseId(supabaseUser.id);
        } else {
          await db.upsertUser({
            supabaseId: supabaseUser.id,
            lastSignedIn: new Date(),
          });
        }
        user = dbUser ?? null;
      }
    }
  } catch (error) {
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
