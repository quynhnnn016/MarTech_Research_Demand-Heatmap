import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
  options?: L.HeatMapOptions;
}

export default function HeatmapLayer({ points, options }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let isMounted = true;
    let heatLayer: any;

    const initHeatmap = async () => {
      if (typeof window !== 'undefined') {
        if (!(window as any).L) {
          // Clone L to avoid "Cannot add property to frozen object" if L is a module namespace
          (window as any).L = { ...L };
        }
      }
      
      try {
        await import('leaflet.heat');
      } catch (e) {
        console.error("Failed to load leaflet.heat", e);
      }
      
      const defaultOptions: L.HeatMapOptions = {
        radius: 25,
        blur: 15,
        maxZoom: 15,
        max: 100, // Assuming intensity is 0-100
        gradient: {
          0.2: '#3b82f6', // Low: Blue
          0.5: '#eab308', // Medium: Yellow
          0.8: '#f97316', // High: Orange
          1.0: '#ef4444'  // Critical: Red
        }
      };

      const heatLayerFn = (L as any).heatLayer || (window as any).L?.heatLayer;
      if (heatLayerFn) {
        const addLayer = () => {
          if (!isMounted || !map) return;
          try {
            const size = map.getSize();
            if (size.x > 0 && size.y > 0) {
              heatLayer = heatLayerFn(points, { ...defaultOptions, ...options }).addTo(map);
            } else {
              // Wait for map to have a size
              setTimeout(addLayer, 100);
            }
          } catch (e) {
            setTimeout(addLayer, 100);
          }
        };
        addLayer();
      } else {
        console.error("L.heatLayer is not defined");
      }
    };

    initHeatmap();

    return () => {
      isMounted = false;
      if (heatLayer && map) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points, options]);

  return null;
}
