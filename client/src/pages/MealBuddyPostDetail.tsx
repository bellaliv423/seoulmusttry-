import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import AuthDialog from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  MapPin,
  Users,
  Send,
  Check,
  X,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";

export default function MealBuddyPostDetail() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const postQuery = trpc.mealBuddy.getPost.useQuery({ id: postId });
  const responsesQuery = trpc.mealBuddy.responsesByPost.useQuery(
    { postId },
    { enabled: isAuthenticated }
  );
  const messagesQuery = trpc.mealBuddy.getMessages.useQuery(
    { postId },
    { enabled: isAuthenticated, refetchInterval: 5000 }
  );

  const utils = trpc.useUtils();

  const createResponseMutation = trpc.mealBuddy.createResponse.useMutation({
    onSuccess: () => {
      toast.success(t("responseSent"));
      utils.mealBuddy.responsesByPost.invalidate({ postId });
    },
  });

  const handleResponseMutation = trpc.mealBuddy.handleResponse.useMutation({
    onSuccess: () => {
      utils.mealBuddy.responsesByPost.invalidate({ postId });
      utils.mealBuddy.getPost.invalidate({ id: postId });
    },
  });

  const sendMessageMutation = trpc.mealBuddy.sendMessage.useMutation({
    onSuccess: () => {
      setChatMessage("");
      utils.mealBuddy.getMessages.invalidate({ postId });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesQuery.data]);

  if (postQuery.isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-6 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text={t("loading")} />
      </div>
    );
  }

  const data = postQuery.data;
  if (!data) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-6 flex items-center justify-center min-h-[50vh]">
        <EmptyState
          title={t("noResults")}
          action={{ label: t("mealBuddy"), onClick: () => window.location.href = '/meal-buddy' }}
        />
      </div>
    );
  }

  const { post, creator, creatorProfile, restaurant } = data;
  const isOwner = user?.id === creator?.id;
  const displayDate =
    typeof post.diningDate === "string"
      ? new Date(post.diningDate)
      : post.diningDate;
  const restaurantName =
    language === "en" && restaurant?.nameEn
      ? restaurant.nameEn
      : restaurant?.name ?? "";

  const handleJoin = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    createResponseMutation.mutate({
      postId,
      message: responseMessage || undefined,
    });
    setResponseMessage("");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    sendMessageMutation.mutate({ postId, content: chatMessage.trim() });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
      {/* Post Header */}
      <div>
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          {restaurant && (
            <Link href={`/restaurant/${restaurant.id}`} className="hover:underline flex items-center gap-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {restaurantName}
              </span>
            </Link>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />{" "}
            {format(displayDate, "yyyy-MM-dd HH:mm")}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" /> {post.currentCompanions}/
            {post.maxCompanions}
          </span>
          <Badge variant={post.status === "open" ? "default" : "secondary"}>
            {post.status}
          </Badge>
        </div>
      </div>

      {/* Creator Info */}
      <Card>
        <CardContent className="flex items-center gap-3 pt-4">
          <Avatar>
            <AvatarImage src={creatorProfile?.profileImage ?? undefined} />
            <AvatarFallback>
              {(creatorProfile?.displayName || creator?.name || "?")[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {creatorProfile?.displayName || creator?.name || "Anonymous"}
            </p>
            {creatorProfile?.nationality && (
              <p className="text-xs text-muted-foreground">
                {creatorProfile.nationality}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {post.description && (
        <Card>
          <CardContent className="pt-4">
            <p className="whitespace-pre-wrap">{post.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Join Section - only if not owner and post is open */}
      {!isOwner && post.status === "open" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("joinRequest")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder={t("postDescription")}
              rows={2}
            />
            <Button
              onClick={handleJoin}
              disabled={createResponseMutation.isPending}
            >
              {t("joinRequest")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Responses - only visible to owner */}
      {isOwner && responsesQuery.data && responsesQuery.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("myResponses")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {responsesQuery.data.map((item) => (
              <div
                key={item.response.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={item.responderProfile?.profileImage ?? undefined}
                    />
                    <AvatarFallback>
                      {(
                        item.responderProfile?.displayName ||
                        item.responder?.name ||
                        "?"
                      )[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {item.responderProfile?.displayName ||
                        item.responder?.name ||
                        "Anonymous"}
                    </p>
                    {item.response.message && (
                      <p className="text-xs text-muted-foreground">
                        {item.response.message}
                      </p>
                    )}
                  </div>
                </div>
                {item.response.status === "pending" ? (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() =>
                        handleResponseMutation.mutate({
                          responseId: item.response.id,
                          status: "accepted",
                        })
                      }
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleResponseMutation.mutate({
                          responseId: item.response.id,
                          status: "declined",
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant={
                      item.response.status === "accepted"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {item.response.status === "accepted"
                      ? t("acceptedRequest")
                      : item.response.status}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Messages / Chat */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("messages")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 space-y-3 overflow-y-auto rounded-md border p-3">
              {(!messagesQuery.data || messagesQuery.data.length === 0) ? (
                <div className="py-8 flex flex-col items-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">{t("noMessages")}</p>
                </div>
              ) : (
                <>
                  {messagesQuery.data.map((item) => {
                    const isMe = item.sender?.id === user?.id;
                    return (
                      <div
                        key={item.message.id}
                        className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarImage
                            src={item.senderProfile?.profileImage ?? undefined}
                          />
                          <AvatarFallback>
                            {(
                              item.senderProfile?.displayName ||
                              item.sender?.name ||
                              "?"
                            )[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${isMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                            }`}
                        >
                          {!isMe && (
                            <p className="mb-0.5 text-xs font-medium opacity-70">
                              {item.senderProfile?.displayName ||
                                item.sender?.name}
                            </p>
                          )}
                          <p>{item.message.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <Separator className="my-3" />

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={t("typeMessage")}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!chatMessage.trim() || sendMessageMutation.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
