export const INITIAL_HOTSPOTS = [
  { id: 'h1', name: 'Bui Vien Walking Street', lat: 10.7675, lng: 106.6938, demand: 980, trend: '+15%', status: 'critical', type: 'Nightlife', rating: 4.5, reviews: 12500, address: 'Bui Vien St, District 1, HCMC', open: 'Closes 4:00 AM', phone: '+84 28 3836 0000', imgSeed: 'nightlife,crowd', peakHour: '01:00 AM', predicted1h: 1150, competitorDensity: 'High (12 nearby)', imageUrl: 'https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/09/co-gi-hot-o-pho-di-bo-bui-vien-e1505380369394.jpg' },
  { id: 'h2', name: 'Vinh Khanh Seafood Hub', lat: 10.7600, lng: 106.7030, demand: 850, trend: '+12%', status: 'high', type: 'Street Food & Beer', rating: 4.3, reviews: 8400, address: 'Vinh Khanh St, District 4, HCMC', open: 'Closes 2:00 AM', phone: '+84 90 123 4567', imgSeed: 'seafood,streetfood', peakHour: '22:00 PM', predicted1h: 920, competitorDensity: 'Medium (5 nearby)', imageUrl: 'https://storage.googleapis.com/inspitrip-blog/global/2018/08/37372743_430684504118201_1403712543465144320_n.jpg' },
  { id: 'h3', name: 'Thao Dien Pubs', lat: 10.8020, lng: 106.7350, demand: 620, trend: '+5%', status: 'medium', type: 'Expat Bars', rating: 4.6, reviews: 5200, address: 'Xuan Thuy St, District 2, HCMC', open: 'Closes 1:00 AM', phone: '+84 28 1111 2222', imgSeed: 'pub,bar', peakHour: '23:00 PM', predicted1h: 650, competitorDensity: 'Low (2 nearby)', imageUrl: 'https://chillvietnam.com/wp-content/uploads/2023/01/stay-pubs-thien-duong-vui-choi-3-tang-nen-thu-tai-thao-dien-sai-gon-1673867631-1024x1024.jpeg' },
  { id: 'h4', name: 'Pham Van Dong Boulevard', lat: 10.8250, lng: 106.7000, demand: 710, trend: '+8%', status: 'high', type: 'Beer Clubs', rating: 4.1, reviews: 9300, address: 'Pham Van Dong, Go Vap, HCMC', open: 'Closes 3:00 AM', phone: '+84 98 765 4321', imgSeed: 'beer,club', peakHour: '00:00 AM', predicted1h: 780, competitorDensity: 'High (15 nearby)', imageUrl: 'https://bht.vn/vnt_upload/project/10_2024/Duong_Pham_Van_Dong_4.jpg' },
  { id: 'h5', name: 'Le Van Sy Food Street', lat: 10.7850, lng: 106.6700, demand: 420, trend: '+1%', status: 'low', type: 'Mixed Dining', rating: 4.2, reviews: 4100, address: 'Le Van Sy St, District 3, HCMC', open: 'Closes 11:30 PM', phone: '+84 28 3333 4444', imgSeed: 'restaurant,food', peakHour: '20:00 PM', predicted1h: 400, competitorDensity: 'Medium (8 nearby)', imageUrl: 'https://thestreetsg.vn/wp-content/uploads/2024/12/NVB_1089.jpg' },
];

export const REGULAR_PLACES = [
  { id: 'r1', name: 'The Local Coffee', lat: 10.7700, lng: 106.6950, type: 'coffee', rating: 4.4, reviews: 320, address: 'District 1, HCMC' },
  { id: 'r2', name: 'Quan Oc 68', lat: 10.7620, lng: 106.7050, type: 'food', rating: 4.0, reviews: 890, address: 'District 4, HCMC' },
  { id: 'r3', name: 'Craft Beer Taproom', lat: 10.8000, lng: 106.7300, type: 'bar', rating: 4.7, reviews: 450, address: 'District 2, HCMC' },
  { id: 'r4', name: 'Night Convenience Store', lat: 10.7680, lng: 106.6960, type: 'store', rating: 3.9, reviews: 120, address: 'District 1, HCMC' },
  { id: 'r5', name: 'Pho Quynh', lat: 10.7660, lng: 106.6920, type: 'food', rating: 4.3, reviews: 2100, address: 'District 1, HCMC' },
  { id: 'r6', name: 'Skybar 360', lat: 10.7720, lng: 106.7020, type: 'bar', rating: 4.5, reviews: 1500, address: 'District 1, HCMC' },
  { id: 'r7', name: 'Riverside BBQ', lat: 10.7900, lng: 106.7100, type: 'food', rating: 4.1, reviews: 670, address: 'Binh Thanh, HCMC' },
  { id: 'r8', name: '24/7 Pharmacy', lat: 10.7690, lng: 106.6940, type: 'pharmacy', rating: 4.8, reviews: 85, address: 'District 1, HCMC' },
];

export const EVENTS = [
  { id: 1, title: 'Sudden Rain in District 1', desc: 'Demand for indoor pubs and cafes spiking.', time: 'Just now', type: 'weather', targetHotspots: ['h1'], effect: { demandChange: +150 } },
  { id: 2, title: 'Football Match Ended', desc: 'Large crowds leaving Nguyen Hue pedestrian street.', time: '5m ago', type: 'event', targetHotspots: ['h1', 'h2'], effect: { demandChange: +300 } },
  { id: 3, title: 'Traffic Jam Cleared', desc: 'Access to Thao Dien is now clear.', time: '12m ago', type: 'traffic', targetHotspots: ['h3'], effect: { demandChange: +50 } },
  { id: 4, title: 'Viral TikTok Post', desc: 'A local food reviewer just posted about Vinh Khanh.', time: '18m ago', type: 'social', targetHotspots: ['h2'], effect: { demandChange: +200 } },
];
