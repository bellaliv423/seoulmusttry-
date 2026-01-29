import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleMapComponent from './GoogleMapComponent';
import KakaoMapComponent from './KakaoMapComponent';
import { Restaurant } from '@/lib/restaurants';

interface MapSelectorProps {
  restaurants: Restaurant[];
  selectedRestaurant?: Restaurant;
  onRestaurantSelect?: (restaurant: Restaurant) => void;
}

export default function MapSelector({
  restaurants,
  selectedRestaurant,
  onRestaurantSelect,
}: MapSelectorProps) {
  const [mapType, setMapType] = useState<'google' | 'kakao'>('google');

  return (
    <div className="w-full">
      <Tabs value={mapType} onValueChange={(v) => setMapType(v as 'google' | 'kakao')}>
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-orange-100">
          <TabsTrigger 
            value="google"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Google Maps
          </TabsTrigger>
          <TabsTrigger 
            value="kakao"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Kakao Maps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="google" className="mt-0">
          <GoogleMapComponent
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            onRestaurantSelect={onRestaurantSelect}
            height="500px"
          />
        </TabsContent>

        <TabsContent value="kakao" className="mt-0">
          <KakaoMapComponent
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            onRestaurantSelect={onRestaurantSelect}
            height="500px"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
