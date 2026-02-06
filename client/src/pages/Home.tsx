import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Star, Heart, Search, MapPin } from 'lucide-react';
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
    { key: null, label: 'All', icon: '🍽️' },
    { key: 'bbq', label: 'K-BBQ', icon: '🥩' },
    { key: 'streetFood', label: 'Street Food', icon: '🍢' },
    { key: 'korean', label: 'Bibimbap', icon: '🍚' },
    { key: 'cafe', label: 'Cafes', icon: '☕' },
    { key: 'noodles', label: 'Noodles', icon: '🍜' },
    { key: 'chicken', label: 'Chicken', icon: '🍗' },
    { key: 'seafood', label: 'Seafood', icon: '🦐' },
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

  const toggleBookmark = (restaurantId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const getPriceSymbol = (price: string) => {
    switch (price) {
      case 'cheap': return '$';
      case 'moderate': return '$$';
      case 'expensive': return '$$$';
      default: return '$';
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="flex w-full items-stretch rounded-xl h-12 shadow-sm bg-white overflow-hidden">
          <div className="flex items-center justify-center pl-4 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder={t('searchPlaceholder') || "Search delicious Seoul"}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedCategory(null);
            }}
            className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-none h-full px-3 text-base font-normal"
          />
        </div>
      </div>

      {/* Category Filter - Horizontal Scroll */}
      <div className="flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.key || 'all'}
            onClick={() => {
              setSelectedCategory(cat.key);
              setSearchQuery('');
            }}
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-5 transition-all ${
              selectedCategory === cat.key
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-white text-muted-foreground hover:bg-accent'
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span className="text-sm font-medium">{t(cat.key as any) || cat.label}</span>
          </button>
        ))}
      </div>

      {/* Featured Banner */}
      <div className="px-4 pt-2">
        <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-md">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
            <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded w-fit mb-2">
              Editor's Pick
            </span>
            <h3 className="text-white text-xl font-bold">Best Night Markets</h3>
            <p className="text-white/80 text-sm">Discover Seoul's hidden gems</p>
          </div>
        </div>
      </div>

      {/* Price Filter */}
      <div className="px-4 py-4">
        <div className="flex gap-2">
          {(['cheap', 'moderate', 'expensive'] as const).map((price) => (
            <Button
              key={price}
              variant={selectedPrice === price ? 'default' : 'outline'}
              onClick={() => setSelectedPrice(selectedPrice === price ? null : price)}
              className={`rounded-full px-4 h-9 text-sm ${
                selectedPrice === price
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : 'bg-white border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              {getPriceSymbol(price)} {t(`price${price.charAt(0).toUpperCase() + price.slice(1)}` as any)}
            </Button>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between px-4 pt-2 pb-3">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          {searchQuery ? t('searchResults') : t('recommendedForYou') || 'Recommended for You'}
        </h2>
        <Link href="/map">
          <button className="text-primary text-sm font-semibold flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {t('mapView') || 'Map'}
          </button>
        </Link>
      </div>

      {/* Restaurant Grid */}
      <div className="px-4 pb-24">
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
            action={{
              label: t('allCategories'),
              onClick: () => {
                setSelectedCategory(null);
                setSearchQuery('');
                setSelectedPrice(null);
              }
            }}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                <div className="flex flex-col gap-2 cursor-pointer group">
                  {/* Image */}
                  <div
                    className="relative w-full aspect-square bg-center bg-no-repeat bg-cover rounded-xl shadow-sm overflow-hidden"
                    style={{
                      backgroundImage: `url("${restaurant.image || 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400'}")`
                    }}
                  >
                    <button
                      onClick={(e) => toggleBookmark(restaurant.id, e)}
                      className={`absolute top-2 right-2 size-8 backdrop-blur-md rounded-full flex items-center justify-center transition-all ${
                        isBookmarked(restaurant.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/20 text-white hover:bg-white/40'
                      }`}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={isBookmarked(restaurant.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                    {/* Price Tag */}
                    <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {getPriceSymbol(restaurant.price)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-1">
                    <p className="text-foreground text-base font-bold leading-tight truncate group-hover:text-primary transition-colors">
                      <HighlightedText text={restaurant.name} highlight={searchQuery} />
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <p className="text-muted-foreground text-xs font-medium">
                        {(restaurant.rating / 10).toFixed(1)} • {getPriceSymbol(restaurant.price)} • {restaurant.reviewCount} {t('reviews')}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
