import { useRoute } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Phone, Clock, Share2, Bookmark, Loader2, MessageSquare } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';
import { toast } from 'sonner';
import MealBuddySection from '@/components/MealBuddySection';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';

export default function RestaurantDetail() {
  const [, params] = useRoute('/restaurant/:id');
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isWritingReview, setIsWritingReview] = useState(false);

  const restaurantId = parseInt(params?.id || '0');

  const {
    data: restaurant,
    isLoading: isLoadingRestaurant,
    isError: isErrorRestaurant,
    refetch: refetchRestaurant
  } = trpc.restaurants.byId.useQuery(
    { id: restaurantId },
    { enabled: restaurantId > 0 }
  );

  const { data: menuItems, isLoading: isLoadingMenu } = trpc.menuItems.byRestaurant.useQuery(
    { restaurantId },
    { enabled: restaurantId > 0 }
  );

  const { data: reviews, isLoading: isLoadingReviews } = trpc.reviews.byRestaurant.useQuery(
    { restaurantId },
    { enabled: restaurantId > 0 }
  );

  const { data: isBookmarked } = trpc.bookmarks.isBookmarked.useQuery(
    { restaurantId },
    { enabled: isAuthenticated && restaurantId > 0 }
  );

  const utils = trpc.useUtils();

  const createBookmark = trpc.bookmarks.create.useMutation({
    onSuccess: () => {
      utils.bookmarks.isBookmarked.invalidate({ restaurantId });
      toast.success(t('bookmarkAdded'));
    },
  });

  const deleteBookmark = trpc.bookmarks.delete.useMutation({
    onSuccess: () => {
      utils.bookmarks.isBookmarked.invalidate({ restaurantId });
      toast.success(t('bookmarkRemoved'));
    },
  });

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      utils.reviews.byRestaurant.invalidate({ restaurantId });
      utils.restaurants.byId.invalidate({ id: restaurantId });
      setReviewText('');
      setReviewRating(5);
      setIsWritingReview(false);
      toast.success(t('reviewAdded'));
    },
    onError: () => {
      toast.error(t('error'));
    },
  });

  const toggleBookmark = () => {
    if (!isAuthenticated) {
      toast.error(t('loginRequired'));
      return;
    }

    if (isBookmarked) {
      deleteBookmark.mutate({ restaurantId });
    } else {
      createBookmark.mutate({ restaurantId });
    }
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast.error(t('loginRequired'));
      return;
    }

    if (reviewText.trim().length === 0) {
      toast.error(t('reviewTextRequired'));
      return;
    }

    createReview.mutate({
      restaurantId,
      rating: reviewRating,
      text: reviewText,
    });
  };

  if (isLoadingRestaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('loading')} />
      </div>
    );
  }

  if (isErrorRestaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <ErrorState onRetry={refetchRestaurant} />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <EmptyState
          title={t('noResults')}
          action={{ label: t('home'), onClick: () => window.location.href = '/' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Image */}
      <div className="relative h-80 bg-gray-200 overflow-hidden">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleBookmark}
            disabled={!isAuthenticated}
            className={`p-3 rounded-full backdrop-blur-md transition-all ${isBookmarked
                ? 'bg-orange-500 text-white'
                : 'bg-white/80 text-gray-700 hover:bg-white'
              } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Bookmark className="w-6 h-6" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button className="p-3 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-md transition-all">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="container py-8">
        {/* Rating & Info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(restaurant.rating / 10)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-lg font-bold text-gray-900">
              {(restaurant.rating / 10).toFixed(1)}
            </span>
            <span className="text-gray-600">
              ({restaurant.reviewCount} {t('reviews')})
            </span>
          </div>

          <p className="text-gray-700 mb-6">{restaurant.description}</p>

          {/* Contact Info */}
          <Card className="p-4 space-y-3 border-orange-100">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{restaurant.address}</span>
            </div>
            {restaurant.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href={`tel:${restaurant.phone}`} className="text-gray-700 hover:text-orange-600">
                  {restaurant.phone}
                </a>
              </div>
            )}
            {restaurant.hours && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-700">{restaurant.hours}</span>
              </div>
            )}
          </Card>
        </div>

        {/* Menu */}
        {menuItems && menuItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('menu')}</h2>
            <Card className="p-6 border-orange-100">
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>
                    <span className="text-orange-600 font-semibold ml-4">
                      ₩{item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Write Review Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('writeReview')}</h2>
          {isAuthenticated ? (
            isWritingReview ? (
              <Card className="p-6 border-orange-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('rating')}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${star <= reviewRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('reviewText')}
                    </label>
                    <Textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={t('writeYourReview')}
                      rows={4}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={createReview.isPending}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {createReview.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {t('submit')}
                    </Button>
                    <Button
                      onClick={() => setIsWritingReview(false)}
                      variant="outline"
                    >
                      {t('cancel')}
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Button
                onClick={() => setIsWritingReview(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {t('writeReview')}
              </Button>
            )
          ) : (
            <Card className="p-6 border-orange-100 text-center">
              <p className="text-gray-600 mb-4">{t('loginToWriteReview')}</p>
              <Button className="bg-orange-500 hover:bg-orange-600">
                {t('login')}
              </Button>
            </Card>
          )}
        </div>

        {/* Meal Buddy */}
        <div className="mb-8">
          <Separator className="mb-8" />
          <MealBuddySection restaurantId={restaurantId} />
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('reviews')}</h2>
          {isLoadingReviews ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6 border-orange-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {review.text && (
                    <p className="text-gray-700">{review.text}</p>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('noReviews')}
              icon={MessageSquare}
              description={t('writeYourReview')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
