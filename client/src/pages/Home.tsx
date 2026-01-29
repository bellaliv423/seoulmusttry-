import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Star, MapPin, Phone, Clock, Bookmark, Search } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { HighlightedText } from '@/components/HighlightedText';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<"cheap" | "moderate" | "expensive" | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'korean', icon: '🍚' },
    { key: 'cafe', icon: '☕' },
    { key: 'streetFood', icon: '🍢' },
    { key: 'bbq', icon: '🥩' },
    { key: 'seafood', icon: '🦐' },
    { key: 'dessert', icon: '🍰' },
    { key: 'noodles', icon: '🍜' },
    { key: 'chicken', icon: '🍗' },
  ];

  // Fetch restaurants based on filters
  const {
    data: allRestaurants,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    refetch: refetchAll
  } = trpc.restaurants.list.useQuery(
    { price: selectedPrice || undefined },
    { enabled: !selectedCategory && !searchQuery }
  );

  const {
    data: categoryRestaurants,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    refetch: refetchCategory
  } = trpc.restaurants.byCategory.useQuery(
    { category: selectedCategory!, price: selectedPrice || undefined },
    { enabled: !!selectedCategory }
  );

  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    refetch: refetchSearch
  } = trpc.restaurants.search.useQuery(
    { query: searchQuery, price: selectedPrice || undefined },
    { enabled: !!searchQuery && searchQuery.length > 0 }
  );

  const { data: bookmarks } = trpc.bookmarks.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const utils = trpc.useUtils();
  const createBookmark = trpc.bookmarks.create.useMutation({
    onSuccess: () => {
      utils.bookmarks.list.invalidate();
      toast.success(t('bookmarkAdded'));
    },
  });

  const deleteBookmark = trpc.bookmarks.delete.useMutation({
    onSuccess: () => {
      utils.bookmarks.list.invalidate();
      toast.success(t('bookmarkRemoved'));
    },
  });

  const filteredRestaurants = selectedCategory
    ? categoryRestaurants
    : searchQuery
      ? searchResults
      : allRestaurants;

  const isLoading = isLoadingAll || isLoadingCategory || isLoadingSearch;
  const isError = isErrorAll || isErrorCategory || isErrorSearch;

  const handleRetry = () => {
    if (selectedCategory) refetchCategory();
    else if (searchQuery) refetchSearch();
    else refetchAll();
  };

  const isBookmarked = (restaurantId: number) => {
    return bookmarks?.some((b) => b.restaurantId === restaurantId) || false;
  };

  const toggleBookmark = (restaurantId: number) => {
    if (!isAuthenticated) {
      toast.error(t('loginRequired'));
      return;
    }

    if (isBookmarked(restaurantId)) {
      deleteBookmark.mutate({ restaurantId });
    } else {
      createBookmark.mutate({ restaurantId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Search Bar */}
      <div className="container px-4 pt-4 pb-2">
        <p className="text-sm text-gray-600 mb-3">{t('appDescription')}</p>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedCategory(null);
            }}
            className="pl-10 py-2 rounded-lg border-orange-200 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="container pt-6 pb-2">
        <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">{t('filterByCategory')}</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
            className={`p-3 rounded-lg text-center transition-all ${selectedCategory === null
              ? 'bg-orange-500 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-orange-50 border border-orange-200'
              }`}
          >
            <div className="text-xl mb-1">🏠</div>
            <div className="text-xs font-medium">{t('home')}</div>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setSelectedCategory(cat.key);
                setSearchQuery('');
              }}
              className={`p-3 rounded-lg text-center transition-all ${selectedCategory === cat.key
                ? 'bg-orange-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-orange-50 border border-orange-200'
                }`}
            >
              <div className="text-xl mb-1">{cat.icon}</div>
              <div className="text-xs font-medium">{t(cat.key as any)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="container py-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">{t('filterByPrice')}</h3>
        <div className="flex gap-2">
          {(['cheap', 'moderate', 'expensive'] as const).map((price) => (
            <Button
              key={price}
              variant={selectedPrice === price ? 'default' : 'outline'}
              onClick={() => setSelectedPrice(selectedPrice === price ? null : price)}
              className={`rounded-full px-4 h-9 transition-all text-sm ${selectedPrice === price
                ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500'
                : 'bg-white border-orange-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50'
                }`}
            >
              <span className="mr-1.5">{price === 'cheap' ? '💰' : price === 'moderate' ? '💰💰' : '💰💰💰'}</span>
              {t(`price${price.charAt(0).toUpperCase() + price.slice(1)}` as any)}
            </Button>
          ))}
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="container pb-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" text={t('loading')} />
          </div>
        ) : isError ? (
          <ErrorState onRetry={handleRetry} />
        ) : !filteredRestaurants || filteredRestaurants.length === 0 ? (
          <EmptyState
            title={t('noResults')}
            icon={Search}
            action={{ label: t('allCategories'), onClick: () => { setSelectedCategory(null); setSearchQuery(''); setSelectedPrice(null); } }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-100 hover:border-orange-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={restaurant.image || 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleBookmark(restaurant.id);
                      }}
                      disabled={!isAuthenticated}
                      className={`p-2 rounded-full backdrop-blur-md transition-all ${isBookmarked(restaurant.id)
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Bookmark className="w-5 h-5" fill={isBookmarked(restaurant.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                    {t(`price${restaurant.price.charAt(0).toUpperCase() + restaurant.price.slice(1)}` as any)}
                  </div>
                </div>


                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                    <HighlightedText text={restaurant.name} highlight={searchQuery} />
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        {(restaurant.rating / 10).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {restaurant.reviewCount} {t('reviews')}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                      <span className="line-clamp-1">
                        <HighlightedText text={restaurant.address} highlight={searchQuery} />
                      </span>
                    </div>
                    {restaurant.hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0 text-orange-500" />
                        <span className="truncate">{restaurant.hours}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/restaurant/${restaurant.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all">
                        {t('restaurantInfo')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
