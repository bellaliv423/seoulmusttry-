import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MapSelector from '@/components/MapSelector';
import { Star, MapPin, Phone, Clock } from 'lucide-react';
import { Link } from 'wouter';
import type { Restaurant } from '@/lib/restaurants';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';

export default function MapPage() {
  const { t } = useLanguage();
  const { data: restaurants, isLoading, error, refetch } = trpc.restaurants.list.useQuery();

  // Adapt DB rows to the Restaurant shape expected by map components
  const mapRestaurants: Restaurant[] = restaurants?.map(r => ({
    ...r,
    id: String(r.id),
    latitude: parseFloat(r.latitude),
    longitude: parseFloat(r.longitude),
    rating: r.rating / 10,
    phone: r.phone || '',
    hours: r.hours || '',
    address: r.address || '',
    description: r.description || '',
    image: r.image || '',
    menu: [],
  })) || [];

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Set initial selection once data loads
  useEffect(() => {
    if (mapRestaurants.length > 0 && !selectedRestaurant) {
      setSelectedRestaurant(mapRestaurants[0]);
    }
  }, [mapRestaurants.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <LoadingSpinner size="lg" text={t('loading')} />
          </div>
        ) : error ? (
          <div className="py-32">
            <ErrorState
              title="Failed to load restaurants"
              description={error.message}
              onRetry={() => refetch()}
            />
          </div>
        ) : mapRestaurants.length === 0 ? (
          <div className="py-32">
            <EmptyState
              title="No restaurants found"
              icon={MapPin}
              description="We couldn't find any restaurants to display on the map."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              {selectedRestaurant && (
                <MapSelector
                  restaurants={mapRestaurants}
                  selectedRestaurant={selectedRestaurant}
                  onRestaurantSelect={setSelectedRestaurant}
                />
              )}
            </div>

            {/* Restaurant List */}
            <div className="lg:col-span-1">
              <div className="sticky top-16 space-y-3 max-h-[calc(100vh-80px)] overflow-y-auto">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t('restaurantInfo')}</h2>

                {mapRestaurants.map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className={`p-3 cursor-pointer transition-all border-2 ${selectedRestaurant?.id === restaurant.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-orange-100 hover:border-orange-300'
                      }`}
                  >
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">
                      {restaurant.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(restaurant.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                            }`}
                        />
                      ))}
                      <span className="text-xs font-semibold text-gray-700 ml-1">
                        {restaurant.rating}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-orange-500" />
                        <span className="line-clamp-2">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 flex-shrink-0 text-orange-500" />
                        <span>{restaurant.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0 text-orange-500" />
                        <span>{restaurant.hours}</span>
                      </div>
                    </div>

                    <Link href={`/restaurant/${restaurant.id}`} className="block mt-2">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs"
                      >
                        {t('restaurantInfo')}
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
