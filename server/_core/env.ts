export const ENV = {
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  isProduction: process.env.NODE_ENV === "production",
  adminEmails: (process.env.ADMIN_EMAILS ?? "").split(",").filter(Boolean),
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? "",
};
