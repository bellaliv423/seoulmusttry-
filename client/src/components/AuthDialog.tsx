import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithKakao } =
    useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onOpenChange(false);
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "kakao") => {
    setError(null);
    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else {
        await signInWithKakao();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "OAuth failed");
    }
  };

  const loginLabel = mode === "login" ? t("login") : t("signUp");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{loginLabel}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* OAuth Buttons */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth("google")}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google {loginLabel}
          </Button>

          <Button
            variant="outline"
            className="w-full bg-[#FEE500] text-[#000000] hover:bg-[#FDD800]"
            onClick={() => handleOAuth("kakao")}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#000000">
              <path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.67 1.74 5.02 4.38 6.38l-1.12 4.12 4.77-3.15c.64.09 1.3.15 1.97.15 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" />
            </svg>
            Kakao {loginLabel}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "..." : loginLabel}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                {t("loginRequired")}{" "}
                <button
                  type="button"
                  className="underline hover:text-foreground"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                >
                  {t("signUp")}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="underline hover:text-foreground"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                >
                  {t("login")}
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
