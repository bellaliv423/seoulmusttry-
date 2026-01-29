import { useEffect, useRef, useState } from 'react';
import { Restaurant } from '@/lib/restaurants';

interface KakaoMapComponentProps {
  restaurants: Restaurant[];
  selectedRestaurant?: Restaurant;
  onRestaurantSelect?: (restaurant: Restaurant) => void;
  height?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMapComponent({
  restaurants,
  selectedRestaurant,
  onRestaurantSelect,
  height = '400px',
}: KakaoMapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const infoWindows = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Kakao Map
  useEffect(() => {
    if (!mapContainer.current || mapLoaded) return;

    // Check if Kakao Maps API is loaded
    if (!window.kakao) {
      console.error('Kakao Maps API not loaded');
      return;
    }

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9784), // Seoul center
      level: 5,
    };

    map.current = new window.kakao.maps.Map(mapContainer.current, options);
    setMapLoaded(true);
  }, [mapLoaded]);

  // Add markers for restaurants
  useEffect(() => {
    if (!map.current || !mapLoaded || !window.kakao) return;

    // Clear existing markers and info windows
    markers.current.forEach(marker => marker.setMap(null));
    infoWindows.current.forEach(infoWindow => infoWindow.close());
    markers.current = [];
    infoWindows.current = [];

    // Create new markers
    restaurants.forEach(restaurant => {
      const position = new window.kakao.maps.LatLng(
        restaurant.latitude,
        restaurant.longitude
      );

      const marker = new window.kakao.maps.Marker({
        position,
        map: map.current,
        title: restaurant.name,
        image: new window.kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerShadow.png',
          new window.kakao.maps.Size(35, 45),
          { offset: new window.kakao.maps.Point(11, 34) }
        ),
      });

      // Create info window
      const content = `
        <div style="padding: 8px 12px; font-size: 12px; font-family: Arial, sans-serif;">
          <strong>${restaurant.name}</strong><br/>
          ⭐ ${restaurant.rating} (${restaurant.reviewCount})<br/>
          <small>${restaurant.address}</small>
        </div>
      `;

      const infoWindow = new window.kakao.maps.InfoWindow({
        content,
        removable: true,
      });

      marker.addListener('click', () => {
        // Close all info windows
        infoWindows.current.forEach(iw => iw.close());
        // Open selected info window
        infoWindow.open(map.current, marker);
        onRestaurantSelect?.(restaurant);
      });

      markers.current.push(marker);
      infoWindows.current.push(infoWindow);
    });

    // Fit bounds to all markers
    if (markers.current.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      markers.current.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.current.setBounds(bounds);
    }
  }, [restaurants, mapLoaded, onRestaurantSelect]);

  // Update selected marker
  useEffect(() => {
    if (!selectedRestaurant || !map.current || !window.kakao) return;

    markers.current.forEach((marker, idx) => {
      if (restaurants[idx].id === selectedRestaurant.id) {
        map.current.panTo(marker.getPosition());
        infoWindows.current[idx]?.open(map.current, marker);
      } else {
        infoWindows.current[idx]?.close();
      }
    });
  }, [selectedRestaurant, restaurants]);

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
