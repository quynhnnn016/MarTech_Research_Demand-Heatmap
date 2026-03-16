import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, Users, MapPin, AlertTriangle, 
  ZoomIn, ZoomOut, Navigation, Clock, Calendar, 
  Activity, Info, X, Flame, Star, Phone, Share2, 
  Bookmark, Navigation2, BellRing, Utensils, Beer, Coffee, Store,
  Loader2, MessageSquare, Twitter, Instagram, Smartphone, Cpu, Radio
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, Polyline, Tooltip as LeafletTooltip } from 'react-leaflet';
import L from 'leaflet';
import HeatmapLayer from './HeatmapLayer';

// --- Simulated Data ---
import { INITIAL_HOTSPOTS, REGULAR_PLACES, EVENTS } from '../data';

const TREND_DATA = [
  { time: '06:00', demand: 100 }, { time: '08:00', demand: 150 },
  { time: '10:00', demand: 200 }, { time: '12:00', demand: 400 },
  { time: '14:00', demand: 350 }, { time: '16:00', demand: 500 },
  { time: '18:00', demand: 800 }, { time: '20:00', demand: 1200 },
  { time: '22:00', demand: 1800 }, { time: '00:00', demand: 2500 },
  { time: '02:00', demand: 2100 }, { time: '04:00', demand: 800 },
];

export default function Dashboard({ 
  selectedPlace, 
  setSelectedPlace, 
  mapCenter, 
  setMapCenter,
  isRecalculating
}: any) {
  const [hotspots, setHotspots] = useState(INITIAL_HOTSPOTS);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeToast, setActiveToast] = useState<typeof EVENTS[0] | null>(null);
  const [myLocation] = useState({ lat: 10.7769, lng: 106.7009 }); // Simulated current location
  const [currentRoute, setCurrentRoute] = useState<[number, number][] | null>(null);

  // New States for Live Feed & AI Processing
  const [showLiveFeed, setShowLiveFeed] = useState(false);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [processingHotspots, setProcessingHotspots] = useState<Record<string, string>>({});
  
  // Legend State
  const [visibleCategories, setVisibleCategories] = useState<string[]>(['Nightlife', 'Street Food & Beer', 'Expat Bars', 'Beer Clubs', 'Mixed Dining', 'coffee', 'food', 'bar', 'store', 'pharmacy']);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hotspotsRef = React.useRef(hotspots);
  useEffect(() => {
    hotspotsRef.current = hotspots;
  }, [hotspots]);

  // Live Data Feed Generator
  useEffect(() => {
    const sources = ['Facebook', 'Instagram', 'TikTok', 'Check-in'];
    const actions = ['mentioned high traffic at', 'posted a photo from', 'checked in at', 'complained about waiting time at'];
    const interval = setInterval(() => {
      const currentHotspots = hotspotsRef.current;
      if (!currentHotspots || currentHotspots.length === 0) return;
      
      const randomHotspot = currentHotspots[Math.floor(Math.random() * currentHotspots.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];

      const newItem = {
        id: Date.now(),
        source,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: `User ${action} ${randomHotspot.name}`,
        action: `Hotspot ${randomHotspot.id} demand updated`
      };

      setLiveFeed(prev => [newItem, ...prev].slice(0, 50));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Simulated Push Notifications & AI Processing Logic
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      const event = EVENTS[currentIndex];
      setActiveToast(event);

      // Trigger AI processing sequence
      if (event.targetHotspots) {
        event.targetHotspots.forEach(id => {
          setProcessingHotspots(prev => ({...prev, [id]: 'Analyzing Sentiment'}));
          
          setTimeout(() => {
            setProcessingHotspots(prev => ({...prev, [id]: 'Calculating Demand'}));
            
            setTimeout(() => {
              setProcessingHotspots(prev => ({...prev, [id]: 'Updating Map'}));
              
              setTimeout(() => {
                setProcessingHotspots(prev => {
                  const next = {...prev};
                  delete next[id];
                  return next;
                });
                
                // Apply the effect to the hotspot
                setHotspots(prev => prev.map(h => {
                  if (h.id === id) {
                    const newDemand = Math.max(100, h.demand + event.effect.demandChange);
                    const newStatus = newDemand > 900 ? 'critical' : newDemand > 600 ? 'high' : newDemand > 300 ? 'medium' : 'low';
                    return { ...h, demand: newDemand, status: newStatus };
                  }
                  return h;
                }));
              }, 1500);
            }, 1500);
          }, 1500);
        });
      }

      setTimeout(() => setActiveToast(null), 6000); // Hide toast after 6s
      currentIndex = (currentIndex + 1) % EVENTS.length;
    }, 25000); // Show new event every 25s

    return () => clearInterval(interval);
  }, []);

  const handleLocateMe = () => {
    setMapCenter({ lat: myLocation.lat, lng: myLocation.lng, zoom: 15 });
  };

  const handleSelectPlace = (place: any) => {
    setSelectedPlace(place);
    setCurrentRoute(null); // Clear route on new selection
    if (place) {
      // Offset longitude slightly to the right so the marker isn't hidden under the 400px left panel
      setMapCenter({ lat: place.lat, lng: place.lng - 0.015, zoom: 14 });
    }
  };

  const handleGetDirections = () => {
    if (selectedPlace) {
      setCurrentRoute([
        [myLocation.lat, myLocation.lng],
        [selectedPlace.lat, selectedPlace.lng]
      ]);
      // Zoom out slightly to show both points
      setMapCenter({ 
        lat: (myLocation.lat + selectedPlace.lat) / 2, 
        lng: (myLocation.lng + selectedPlace.lng) / 2 - 0.01, 
        zoom: 13 
      });
    }
  };

  // Helper for feed icons
  const getFeedIcon = (source: string) => {
    switch(source) {
      case 'Facebook': return <MessageSquare size={14} className="text-blue-600" />;
      case 'Twitter': return <Twitter size={14} className="text-sky-500" />;
      case 'Instagram': return <Instagram size={14} className="text-pink-600" />;
      case 'TikTok': return <Smartphone size={14} className="text-black" />;
      default: return <MapPin size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col relative animate-in fade-in duration-500 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
      
      {/* Live Feed Toggle Button */}
      <button 
        onClick={() => setShowLiveFeed(!showLiveFeed)} 
        className="absolute top-6 right-6 z-[1000] bg-white p-3 rounded-full shadow-xl border border-gray-200 hover:bg-gray-50 transition-colors group pointer-events-auto"
        title="Live Data Feed"
      >
        <Radio size={24} className="text-blue-600 group-hover:animate-pulse" />
        <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
      </button>

      {/* Live Feed Panel */}
      <div className={`absolute top-0 right-0 h-full w-[380px] bg-white/95 backdrop-blur-2xl shadow-2xl border-l border-gray-200 z-[1001] transition-transform duration-500 ease-in-out flex flex-col pointer-events-auto ${showLiveFeed ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Radio className="text-blue-600 animate-pulse" size={20} />
            Live Data Stream
          </h2>
          <button onClick={() => setShowLiveFeed(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={18}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {liveFeed.length === 0 && (
            <div className="text-center text-gray-500 text-sm mt-10 flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-blue-400" size={24} />
              Listening to social signals...
            </div>
          )}
          {liveFeed.map(item => (
            <div key={item.id} className="animate-in slide-in-from-right fade-in duration-500 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex gap-3 hover:shadow-md transition-shadow">
              <div className="mt-1 bg-gray-50 p-2 rounded-full h-fit">{getFeedIcon(item.source)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.source}</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
                <div className="text-sm text-gray-800 font-medium leading-snug">{item.text}</div>
                <div className="mt-2 pt-2 border-t border-gray-50 text-xs font-semibold text-blue-600 flex items-center gap-1.5">
                  <Cpu size={12} className="text-blue-500"/> {item.action}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Bar - Search & Status */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex items-start justify-between pointer-events-none">
        {/* Google Maps style search box */}
        <div className="w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden pointer-events-auto flex items-center px-4 py-3">
          <Activity size={20} className="text-orange-500 animate-pulse mr-3" />
          <input 
            type="text" 
            placeholder="Search hotspots, demand zones..." 
            className="bg-transparent border-none outline-none text-gray-900 w-full placeholder:text-gray-400"
          />
          <div className="w-px h-6 bg-gray-200 mx-3"></div>
          <button className="text-gray-500 hover:text-gray-900 transition-colors">
            <Navigation2 size={20} />
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-200 shadow-lg flex items-center gap-4 text-sm font-mono">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Calendar size={14} className="text-orange-500" />
              {currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </div>
            <div className="flex items-center gap-1.5 text-gray-900 font-bold">
              <Clock size={14} className="text-orange-500" />
              {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Push Notification Toast */}
      <div className={`absolute top-20 left-1/2 -translate-x-1/2 z-[600] transition-all duration-500 transform ${activeToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        {activeToast && (
          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 flex items-start gap-4 w-[400px]">
            <div className={`p-2 rounded-full ${
              activeToast.type === 'critical' ? 'bg-red-50 text-red-500' : 
              activeToast.type === 'warning' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
            }`}>
              <BellRing size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 font-bold text-sm">{activeToast.title}</h4>
              <p className="text-gray-600 text-xs mt-1 leading-relaxed">{activeToast.message}</p>
              {activeToast.targetHotspots && activeToast.targetHotspots.length > 0 && (
                <button 
                  onClick={() => {
                    const place = hotspots.find(h => h.id === activeToast.targetHotspots[0]);
                    if (place) handleSelectPlace(place);
                    setActiveToast(null);
                  }}
                  className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Navigation2 size={12} />
                  View Hotspot
                </button>
              )}
            </div>
            <button onClick={() => setActiveToast(null)} className="text-gray-400 hover:text-gray-900">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Right Panel: Live Events Feed */}
      <div className="absolute top-24 right-6 w-80 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-[500] flex flex-col overflow-hidden pointer-events-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-gray-900 font-bold flex items-center gap-2 text-sm">
            <Activity size={16} className="text-orange-500" />
            Live Events Feed
          </h3>
          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[400px] p-2 space-y-2">
          {EVENTS.map(note => (
            <div key={note.id} className="p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${
                  note.type === 'critical' ? 'text-red-600' : 
                  note.type === 'warning' ? 'text-orange-600' : 'text-blue-600'
                }`}>{note.title}</span>
                <span className="text-[10px] text-gray-400">Just now</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{note.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Map Area */}
      <div className="flex-1 relative bg-gray-100 overflow-hidden">
        <InteractiveMap 
          onSelectPlace={handleSelectPlace} 
          selectedPlace={selectedPlace} 
          mapCenter={mapCenter}
          setMapCenter={setMapCenter}
          myLocation={myLocation}
          onLocateMe={handleLocateMe}
          currentRoute={currentRoute}
          hotspots={hotspots}
          processingHotspots={processingHotspots}
          isRecalculating={isRecalculating}
          visibleCategories={visibleCategories}
          setVisibleCategories={setVisibleCategories}
        />
        
        {/* Left Panel: Place Details (Google Maps Style) */}
        <div className={`absolute top-0 left-0 h-full w-[400px] bg-white shadow-2xl border-r border-gray-200 z-[1000] transition-transform duration-300 ease-in-out flex flex-col ${selectedPlace ? 'translate-x-0' : '-translate-x-full'}`}>
          {selectedPlace && (
            <>
              {/* Header Image */}
              <div className="h-48 relative bg-gray-200 shrink-0">
                <img 
                  src={selectedPlace.imageUrl || `https://picsum.photos/seed/${selectedPlace.imgSeed || selectedPlace.type}/400/200`} 
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => handleSelectPlace(null)} 
                  className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-colors shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPlace.name}</h2>
                
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <span className="text-orange-500 font-bold">{selectedPlace.rating || 'N/A'}</span>
                  <div className="flex text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(selectedPlace.rating || 0) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-gray-500">({selectedPlace.reviews?.toLocaleString() || 0})</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600 capitalize">{selectedPlace.type}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 mb-6 pb-6 border-b border-gray-100">
                  <ActionButton 
                    icon={<Navigation2 size={20} />} 
                    label="Directions" 
                    primary 
                    onClick={handleGetDirections}
                  />
                  <ActionButton icon={<Bookmark size={20} />} label="Save" />
                  <ActionButton icon={<Share2 size={20} />} label="Share" />
                </div>

                {/* Info List */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                  <InfoRow icon={<MapPin size={18} />} text={selectedPlace.address} />
                  <InfoRow icon={<Clock size={18} />} text={selectedPlace.open || 'Open 24 hours'} highlight />
                  <InfoRow icon={<Phone size={18} />} text={selectedPlace.phone || 'No phone available'} />
                </div>

                {/* Demand Intelligence (Only for Hotspots) */}
                {selectedPlace.demand && (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50/50 border border-orange-100 rounded-2xl p-5 mb-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Flame size={16} className="text-orange-500" />
                      Live Demand Intelligence
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Current Demand Index</div>
                        <div className={`text-3xl font-bold ${selectedPlace.status === 'critical' ? 'text-red-600' : 'text-orange-600'}`}>
                          {selectedPlace.demand}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">1h Trend</div>
                        <div className="text-xl font-bold text-gray-900 flex items-center gap-1">
                          <TrendingUp size={16} className="text-red-500" />
                          {selectedPlace.trend}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-4">
                      <div className="bg-white/60 p-3 rounded-xl border border-orange-100/50">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <Clock size={12} /> Historical Peak Hour
                        </div>
                        <div className="text-sm font-bold text-gray-900">{selectedPlace.peakHour}</div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-xl border border-orange-100/50">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <Activity size={12} /> Predicted Demand (1h)
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold text-gray-900">{selectedPlace.predicted1h}</div>
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(selectedPlace.predicted1h / 2000) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-xl border border-orange-100/50">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <Users size={12} /> Competitor Density
                        </div>
                        <div className="text-sm font-bold text-gray-900">{selectedPlace.competitorDensity}</div>
                      </div>
                    </div>

                    <div className="h-32 w-full mt-4">
                      <div className="text-xs text-gray-500 mb-2 font-medium">24h Demand Trend</div>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={TREND_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="time" hide />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                            labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                          />
                          <Area type="monotone" dataKey="demand" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-full border border-gray-200 z-[500] flex items-center gap-6 shadow-lg pointer-events-none">
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Demand Density</div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Low</span>
            <div className="w-48 h-2.5 rounded-full bg-gradient-to-r from-gray-200 via-yellow-400 via-orange-500 to-red-600"></div>
            <span className="text-xs text-gray-500">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, primary, onClick }: { icon: React.ReactNode, label: string, primary?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-2 flex-1 py-2 rounded-xl transition-colors ${primary ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${primary ? 'bg-blue-100' : 'bg-gray-50 border border-gray-200'}`}>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function InfoRow({ icon, text, highlight }: { icon: React.ReactNode, text: string, highlight?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div className={`text-sm ${highlight ? 'text-green-600 font-medium' : 'text-gray-700'}`}>{text}</div>
    </div>
  );
}

// --- Interactive Map Component ---
function MapController({ center, zoom }: { center: {lat: number, lng: number}, zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom);
  }, [center, zoom, map]);
  return null;
}

const createHotspotIcon = (poi: any, isSelected: boolean, isCritical: boolean) => {
  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-all duration-300 ${
      isSelected 
        ? 'bg-white border-orange-500 scale-125 z-50' 
        : isCritical 
          ? 'bg-red-600 border-white hover:scale-110 z-40' 
          : 'bg-orange-500 border-white hover:scale-110 z-30'
    }">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? '#f97316' : '#ffffff'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>
  `;
  return L.divIcon({
    className: 'custom-marker',
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createRegularIcon = (place: any, isSelected: boolean) => {
  const html = `
    <div class="flex items-center gap-1.5 transition-all duration-200 ${isSelected ? 'scale-110' : 'hover:scale-110'}">
      <div class="w-6 h-6 rounded-full flex items-center justify-center shadow-md border ${
        isSelected ? 'bg-white text-blue-600 border-blue-500' : 'bg-white text-gray-600 border-gray-200'
      }">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/90 border border-gray-200 whitespace-nowrap shadow-sm transition-opacity ${
        isSelected ? 'opacity-100 text-gray-900' : 'opacity-0 text-gray-600'
      }">
        ${place.name}
      </span>
    </div>
  `;
  return L.divIcon({
    className: 'custom-marker',
    html,
    iconSize: [120, 24],
    iconAnchor: [12, 12],
  });
};

const createLocationIcon = () => {
  const html = `
    <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] relative">
      <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75 scale-150"></div>
    </div>
  `;
  return L.divIcon({
    className: 'custom-marker',
    html,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

function InteractiveMap({ onSelectPlace, selectedPlace, mapCenter, setMapCenter, myLocation, onLocateMe, currentRoute, hotspots, processingHotspots, isRecalculating, visibleCategories, setVisibleCategories }: any) {
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Map Controls (Right Side) */}
      <div className="absolute bottom-24 right-6 flex flex-col gap-4 z-[400]">
        <button 
          onClick={onLocateMe} 
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-blue-600 hover:bg-gray-50 transition-colors shadow-xl"
          title="Locate Me"
        >
          <Navigation size={18} className="fill-current" />
        </button>
      </div>

      {/* Interactive Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl z-[400] p-4 w-64 pointer-events-auto">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Map Legend</h4>
        
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Demand Hotspots</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> Critical (&gt;900)
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div> High (600-900)
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div> Medium (300-600)
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Places (Click to toggle)</div>
            <div className="grid grid-cols-2 gap-2">
              {['coffee', 'food', 'bar', 'store', 'pharmacy'].map(type => (
                <button 
                  key={type}
                  onClick={() => {
                    const newCategories = visibleCategories.includes(type) 
                      ? visibleCategories.filter((c: string) => c !== type)
                      : [...visibleCategories, type];
                    setVisibleCategories(newCategories);
                  }}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${visibleCategories.includes(type) ? 'text-gray-900' : 'text-gray-400 line-through'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${visibleCategories.includes(type) ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay for Settings Reload */}
      {isRecalculating && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-[500] flex flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-orange-500" size={32} />
            <div className="text-center">
              <h3 className="font-bold text-gray-900">Applying New Parameters</h3>
              <p className="text-sm text-gray-500">Recalculating spatial demand index...</p>
            </div>
          </div>
        </div>
      )}

      <MapContainer 
        center={[mapCenter.lat, mapCenter.lng]} 
        zoom={mapCenter.zoom} 
        style={{ height: '100%', width: '100%', background: '#f3f4f6' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <MapController center={{lat: mapCenter.lat, lng: mapCenter.lng}} zoom={mapCenter.zoom} />
        
        {/* Light Mode Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* My Location Dot */}
        <Marker position={[myLocation.lat, myLocation.lng]} icon={createLocationIcon()} />

        {/* Regular Places Markers */}
        {REGULAR_PLACES.filter(p => visibleCategories.includes(p.type)).map(place => (
          <Marker 
            key={place.id} 
            position={[place.lat, place.lng]} 
            icon={createRegularIcon(place, selectedPlace?.id === place.id)}
            eventHandlers={{
              click: () => onSelectPlace(place),
            }}
          />
        ))}

        {/* Heatmap Layer */}
        <HeatmapLayer 
          points={hotspots.map(poi => [poi.lat, poi.lng, poi.demand / 1000])} 
          options={{
            radius: 35,
            blur: 25,
            maxZoom: 15,
            max: 1.0,
            gradient: {
              0.2: '#3b82f6', // Low: Blue
              0.5: '#eab308', // Medium: Yellow
              0.8: '#f97316', // High: Orange
              1.0: '#ef4444'  // Critical: Red
            }
          }}
        />

        {/* Hotspot Markers */}
        {hotspots.map(poi => (
          <Marker 
            key={`marker-${poi.id}`} 
            position={[poi.lat, poi.lng]} 
            icon={createHotspotIcon(poi, selectedPlace?.id === poi.id, poi.status === 'critical')}
            eventHandlers={{
              click: () => onSelectPlace(poi),
            }}
          >
            {processingHotspots[poi.id] && (
              <LeafletTooltip permanent direction="top" offset={[0, -20]} className="!bg-white/95 !backdrop-blur-md !border-blue-200 !shadow-xl !rounded-xl !p-0 !text-blue-700">
                <div className="flex items-center gap-2 px-3 py-2 font-mono text-xs font-bold">
                  <Loader2 className="animate-spin text-blue-500" size={14} />
                  {processingHotspots[poi.id]}...
                </div>
              </LeafletTooltip>
            )}
          </Marker>
        ))}

        {/* Smart Route Polyline */}
        {currentRoute && (
          <Polyline 
            positions={currentRoute} 
            color="#3b82f6" 
            weight={4} 
            dashArray="10, 10" 
            className="animate-pulse"
          />
        )}
      </MapContainer>
    </div>
  );
}

