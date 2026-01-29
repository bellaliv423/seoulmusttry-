import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import MealBuddyCard from "./MealBuddyCard";
import CreateMealBuddyPostDialog from "./CreateMealBuddyPostDialog";
import AuthDialog from "./AuthDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

type Props = {
  restaurantId: number;
};

export default function MealBuddySection({ restaurantId }: Props) {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const postsQuery = trpc.mealBuddy.postsByRestaurant.useQuery({
    restaurantId,
  });

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setCreateOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("mealBuddy")}</h3>
        <Button size="sm" onClick={handleCreateClick}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          {t("createPost")}
        </Button>
      </div>

      {postsQuery.isLoading && (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      )}

      {postsQuery.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("noPosts")}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {postsQuery.data?.map((item) => (
          <MealBuddyCard
            key={item.post.id}
            post={item.post}
            creator={item.creator}
            creatorProfile={item.creatorProfile}
            restaurant={item.restaurant}
          />
        ))}
      </div>

      <div className="text-center">
        <Link href="/meal-buddy">
          <Button variant="link" size="sm">
            {t("findDiningBuddy")} →
          </Button>
        </Link>
      </div>

      <CreateMealBuddyPostDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        restaurantId={restaurantId}
      />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
