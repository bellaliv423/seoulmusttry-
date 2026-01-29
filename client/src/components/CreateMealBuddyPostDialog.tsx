import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId?: number;
};

export default function CreateMealBuddyPostDialog({
  open,
  onOpenChange,
  restaurantId: presetRestaurantId,
}: Props) {
  const { t } = useLanguage();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [restaurantId, setRestaurantId] = useState(
    presetRestaurantId?.toString() ?? ""
  );
  const [diningDate, setDiningDate] = useState("");
  const [maxCompanions, setMaxCompanions] = useState("2");
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>([]);

  const restaurantsQuery = trpc.restaurants.list.useQuery(undefined, {
    enabled: open && !presetRestaurantId,
  });

  const createPostMutation = trpc.mealBuddy.createPost.useMutation({
    onSuccess: () => {
      toast.success(t("postCreated"));
      utils.mealBuddy.allPosts.invalidate();
      utils.mealBuddy.myPosts.invalidate();
      if (restaurantId) {
        utils.mealBuddy.postsByRestaurant.invalidate({
          restaurantId: Number(restaurantId),
        });
      }
      onOpenChange(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    if (!presetRestaurantId) setRestaurantId("");
    setDiningDate("");
    setMaxCompanions("2");
    setPreferredLanguages([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate({
      restaurantId: Number(restaurantId),
      title,
      description: description || undefined,
      diningDate,
      maxCompanions: Number(maxCompanions),
      preferredLanguages:
        preferredLanguages.length > 0
          ? JSON.stringify(preferredLanguages)
          : undefined,
    });
  };

  const toggleLang = (lang: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("createPost")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1">
            <Label>{t("postTitle")}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>

          {!presetRestaurantId && (
            <div className="space-y-1">
              <Label>{t("restaurantInfo")}</Label>
              <Select value={restaurantId} onValueChange={setRestaurantId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {restaurantsQuery.data?.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1">
            <Label>{t("diningDate")}</Label>
            <Input
              type="datetime-local"
              value={diningDate}
              onChange={(e) => setDiningDate(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-1">
            <Label>{t("maxCompanions")}</Label>
            <Select value={maxCompanions} onValueChange={setMaxCompanions}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>{t("preferredLanguages")}</Label>
            <div className="flex gap-2 flex-wrap">
              {["ko", "en", "zh-TW", "zh-CN", "ja"].map((lang) => (
                <Button
                  key={lang}
                  type="button"
                  size="sm"
                  variant={preferredLanguages.includes(lang) ? "default" : "outline"}
                  onClick={() => toggleLang(lang)}
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label>{t("postDescription")}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={createPostMutation.isPending || !restaurantId || !diningDate}
          >
            {createPostMutation.isPending ? t("loading") : t("submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
