import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import MealBuddyCard from "@/components/MealBuddyCard";
import CreateMealBuddyPostDialog from "@/components/CreateMealBuddyPostDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, UtensilsCrossed } from "lucide-react";
import AuthDialog from "@/components/AuthDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";

export default function MealBuddyPage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const allPostsQuery = trpc.mealBuddy.allPosts.useQuery();
  const myPostsQuery = trpc.mealBuddy.myPosts.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const myResponsesQuery = trpc.mealBuddy.myResponses.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setCreateOpen(true);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("mealBuddy")}</h1>
          <p className="text-muted-foreground">{t("mealBuddyDesc")}</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-1 h-4 w-4" />
          {t("createPost")}
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t("findDiningBuddy")}</TabsTrigger>
          {isAuthenticated && (
            <>
              <TabsTrigger value="myPosts">{t("myPosts")}</TabsTrigger>
              <TabsTrigger value="myResponses">{t("myResponses")}</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {allPostsQuery.isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="lg" text={t("loading")} />
            </div>
          ) : allPostsQuery.data?.length === 0 ? (
            <EmptyState
              title={t("noPosts")}
              icon={UtensilsCrossed}
              description={t("createPostDesc")}
              action={{ label: t("createPost"), onClick: handleCreateClick }}
              className="py-12"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {allPostsQuery.data?.map((item) => (
                <MealBuddyCard
                  key={item.post.id}
                  post={item.post}
                  creator={item.creator}
                  creatorProfile={item.creatorProfile}
                  restaurant={item.restaurant}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {isAuthenticated && (
          <TabsContent value="myPosts" className="mt-4">
            {myPostsQuery.isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="lg" text={t("loading")} />
              </div>
            ) : myPostsQuery.data?.length === 0 ? (
              <EmptyState
                title={t("noPosts")}
                action={{ label: t("createPost"), onClick: handleCreateClick }}
                className="py-12"
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {myPostsQuery.data?.map((item) => (
                  <MealBuddyCard
                    key={item.post.id}
                    post={item.post}
                    restaurant={item.restaurant}
                    isOwner
                  />
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {isAuthenticated && (
          <TabsContent value="myResponses" className="mt-4">
            {myResponsesQuery.isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="lg" text={t("loading")} />
              </div>
            ) : myResponsesQuery.data?.length === 0 ? (
              <EmptyState
                title={t("noPosts")}
                description={t("findDiningBuddyDesc")}
                className="py-12"
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {myResponsesQuery.data?.map((item) => (
                  <MealBuddyCard
                    key={item.response.id}
                    post={item.post!}
                    restaurant={item.restaurant}
                    responseStatus={item.response.status}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      <CreateMealBuddyPostDialog open={createOpen} onOpenChange={setCreateOpen} />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
