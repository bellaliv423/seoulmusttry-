import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Redirect } from "wouter";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, loading } = useAuth();

  const profileQuery = trpc.mealBuddy.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateProfileMutation = trpc.mealBuddy.updateProfile.useMutation({
    onSuccess: () => {
      toast.success(t("profileSaved"));
      profileQuery.refetch();
    },
  });

  const [displayName, setDisplayName] = useState("");
  const [nationality, setNationality] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [foodPreferences, setFoodPreferences] = useState("");
  const [bio, setBio] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  useEffect(() => {
    if (profileQuery.data) {
      const p = profileQuery.data;
      setDisplayName(p.displayName || "");
      setNationality(p.nationality || "");
      setPreferredLanguage(p.preferredLanguage || "");
      setFoodPreferences(p.foodPreferences || "");
      setBio(p.bio || "");
      setContactMethod(p.contactMethod || "");
      setContactInfo(p.contactInfo || "");
    } else if (user) {
      setDisplayName(user.name || "");
    }
  }, [profileQuery.data, user]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6 flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      displayName,
      nationality: nationality || undefined,
      preferredLanguage: preferredLanguage || undefined,
      foodPreferences: foodPreferences || undefined,
      bio: bio || undefined,
      contactMethod: contactMethod || undefined,
      contactInfo: contactInfo || undefined,
    });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">{t("editProfile")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("myProfile")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>{t("displayName")}</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-1">
              <Label>{t("nationality")}</Label>
              <Input
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="e.g. Taiwan, Korea, USA"
                maxLength={64}
              />
            </div>

            <div className="space-y-1">
              <Label>{t("language")}</Label>
              <Select
                value={preferredLanguage}
                onValueChange={setPreferredLanguage}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh-TW">繁體中文</SelectItem>
                  <SelectItem value="zh-CN">简体中文</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>{t("foodPreferences")}</Label>
              <Input
                value={foodPreferences}
                onChange={(e) => setFoodPreferences(e.target.value)}
                placeholder="e.g. Korean BBQ, Vegetarian, Spicy food"
              />
            </div>

            <div className="space-y-1">
              <Label>{t("bio")}</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>{t("contactInfo")} (Method)</Label>
                <Select value={contactMethod} onValueChange={setContactMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kakao">KakaoTalk</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="line">LINE</SelectItem>
                    <SelectItem value="wechat">WeChat</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>{t("contactInfo")} (ID)</Label>
                <Input
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Your ID / handle"
                  maxLength={200}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  {t("loading")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
