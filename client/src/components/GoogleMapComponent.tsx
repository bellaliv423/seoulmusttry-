import { useEffect, useRef, useState } from 'react';
import { Restaurant } from '@/lib/restaurants';
import { MapPin } from 'lucide-react';

interface GoogleMapComponentProps {
  restaurants: Restaurant[];
  selectedRestaurant?: Restaurant;
  onRestaurantSelect?: (restaurant: Restaurant) => void;
  height?: string;
}

export default function GoogleMapComponent({
  restaurants,
  selectedRestaurant,
  onRestaurantSelect,
  height = '400px',
}: GoogleMapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Google Map
  useEffect(() => {
    if (!mapContainer.current || mapLoaded) return;

    // Create map centered on Seoul
    const mapOptions: google.maps.MapOptions = {
      zoom: 13,
      center: { lat: 37.5665, lng: 126.9784 }, // Seoul center
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
      streetViewControl: false,
    };

    map.current = new google.maps.Map(mapContainer.current, mapOptions);
    setMapLoaded(true);
  }, [mapLoaded]);

  // Add markers for restaurants
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // Create new markers
    restaurants.forEach(restaurant => {
      const marker = new google.maps.Marker({
        position: { lat: restaurant.latitude, lng: restaurant.longitude },
        map: map.current,
        title: restaurant.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: selectedRestaurant?.id === restaurant.id ? '#FF6B35' : '#FFB84D',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        onRestaurantSelect?.(restaurant);
        // Pan to marker
        map.current?.panTo(marker.getPosition()!);
      });

      markers.current.push(marker);
    });

    // Fit bounds to all markers
    if (markers.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.current.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      map.current.fitBounds(bounds);
    }
  }, [restaurants, mapLoaded, selectedRestaurant, onRestaurantSelect]);

  // Update selected marker
  useEffect(() => {
    if (!selectedRestaurant || !map.current) return;

    markers.current.forEach(marker => {
      const isSelected = marker.getTitle() === selectedRestaurant.name;
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 10 : 8,
        fillColor: isSelected ? '#FF6B35' : '#FFB84D',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      });
    });

    // Pan to selected restaurant
    map.current.panTo({
      lat: selectedRestaurant.latitude,
      lng: selectedRestaurant.longitude,
    });
  }, [selectedRestaurant]);

  return (
    <div className="w-full rounded-lg overflow-hidden border-2 border-orange-200">
      <div
        ref={mapContainer}
        style={{ height }}
        className="w-full bg-gray-100"
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">지도 로딩 중...</p>
        </div>
      )}
    </div>
  );
}
