import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from "lucide-react";

type MealBuddyCardProps = {
  post: {
    id: number;
    title: string;
    diningDate: Date | string;
    maxCompanions: number;
    currentCompanions: number;
    status: string;
    preferredLanguages?: string | null;
  };
  creator?: { id: number; name: string | null } | null;
  creatorProfile?: {
    displayName: string | null;
    nationality: string | null;
    profileImage: string | null;
  } | null;
  restaurant?: {
    id: number;
    name: string;
    nameEn?: string | null;
    category?: string | null;
  } | null;
  isOwner?: boolean;
  responseStatus?: string | null;
};

export default function MealBuddyCard({
  post,
  creator,
  creatorProfile,
  restaurant,
  isOwner,
  responseStatus,
}: MealBuddyCardProps) {
  const { t, language } = useLanguage();
  const displayDate =
    typeof post.diningDate === "string"
      ? new Date(post.diningDate)
      : post.diningDate;
  const restaurantName =
    language === "en" && restaurant?.nameEn
      ? restaurant.nameEn
      : restaurant?.name ?? "";

  const langs = post.preferredLanguages
    ? JSON.parse(post.preferredLanguages) as string[]
    : [];

  return (
    <Link href={`/meal-buddy/${post.id}`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base leading-tight">{post.title}</CardTitle>
            {responseStatus && (
              <Badge
                variant={
                  responseStatus === "accepted"
                    ? "default"
                    : responseStatus === "declined"
                      ? "destructive"
                      : "secondary"
                }
              >
                {responseStatus === "accepted"
                  ? t("acceptedRequest")
                  : responseStatus === "pending"
                    ? t("pendingRequest")
                    : responseStatus}
              </Badge>
            )}
            {isOwner && (
              <Badge variant="outline">{post.status}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {restaurant && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{restaurantName}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{format(displayDate, "yyyy-MM-dd HH:mm")}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>
              {post.currentCompanions}/{post.maxCompanions}
            </span>
          </div>
          {langs.length > 0 && (
            <div className="flex gap-1">
              {langs.map((l: string) => (
                <Badge key={l} variant="secondary" className="text-xs">
                  {l}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        {creator && (
          <CardFooter className="pt-0 text-xs text-muted-foreground">
            {creatorProfile?.displayName || creator.name || "Anonymous"}
            {creatorProfile?.nationality && ` · ${creatorProfile.nationality}`}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
