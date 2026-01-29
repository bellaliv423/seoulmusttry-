import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/useMobile";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthDialog from "@/components/AuthDialog";
import {
  Menu,
  Home,
  Map,
  Users,
  User,
  ArrowLeft,
  LogOut,
} from "lucide-react";

const NAV_LINKS = [
  { path: "/", labelKey: "home", Icon: Home },
  { path: "/map", labelKey: "map", Icon: Map },
  { path: "/meal-buddy", labelKey: "mealBuddy", Icon: Users },
] as const;

function isDetailPage(path: string): boolean {
  return (
    path.startsWith("/restaurant/") ||
    (path.startsWith("/meal-buddy/") && path !== "/meal-buddy") ||
    path === "/profile"
  );
}

export default function Navbar() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile();
  const [authOpen, setAuthOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const showBack = isDetailPage(location);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="container flex items-center justify-between h-14 px-4">
          {/* Left: back button + logo */}
          <div className="flex items-center gap-1">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <Link href="/">
              <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent whitespace-nowrap">
                {t("appName")}
              </span>
            </Link>
          </div>

          {/* Center: desktop nav links */}
          {!isMobile && (
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map(({ path, labelKey, Icon }) => {
                const isActive = location === path;
                return (
                  <Link key={path} href={path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={
                        isActive
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      }
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {t(labelKey)}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right: language + auth (desktop) or hamburger (mobile) */}
          <div className="flex items-center gap-2">
            {!isMobile && (
              <>
                <LanguageSwitcher />
                {isAuthenticated ? (
                  <div className="flex items-center gap-1">
                    <Link href="/profile">
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                            {(user?.name || user?.email || "?")[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm max-w-[100px] truncate">
                          {user?.name || user?.email?.split("@")[0]}
                        </span>
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={logout} title={t("logout")}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={() => setAuthOpen(true)}
                  >
                    {t("login")}
                  </Button>
                )}
              </>
            )}

            {/* Mobile hamburger */}
            {isMobile && (
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 flex flex-col">
                  <SheetHeader>
                    <SheetTitle className="text-left bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      {t("appName")}
                    </SheetTitle>
                  </SheetHeader>

                  {/* Nav links */}
                  <nav className="flex flex-col gap-1 mt-4">
                    {NAV_LINKS.map(({ path, labelKey, Icon }) => {
                      const isActive = location === path;
                      return (
                        <SheetClose asChild key={path}>
                          <Link href={path}>
                            <Button
                              variant="ghost"
                              className={`w-full justify-start gap-2 ${
                                isActive ? "bg-orange-50 text-orange-600" : ""
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              {t(labelKey)}
                            </Button>
                          </Link>
                        </SheetClose>
                      );
                    })}

                    {isAuthenticated && (
                      <SheetClose asChild>
                        <Link href="/profile">
                          <Button
                            variant="ghost"
                            className={`w-full justify-start gap-2 ${
                              location === "/profile" ? "bg-orange-50 text-orange-600" : ""
                            }`}
                          >
                            <User className="w-5 h-5" />
                            {t("profile")}
                          </Button>
                        </Link>
                      </SheetClose>
                    )}
                  </nav>

                  {/* Language switcher */}
                  <div className="mt-6">
                    <LanguageSwitcher />
                  </div>

                  {/* Auth section at bottom */}
                  <div className="mt-auto pb-4">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-orange-100 text-orange-700">
                              {(user?.name || user?.email || "?")[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">
                            {user?.name || user?.email}
                          </span>
                        </div>
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={logout}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            {t("logout")}
                          </Button>
                        </SheetClose>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <Button
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          onClick={() => setAuthOpen(true)}
                        >
                          {t("login")}
                        </Button>
                      </SheetClose>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
