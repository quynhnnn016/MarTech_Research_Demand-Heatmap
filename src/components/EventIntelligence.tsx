import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Users, TrendingUp, AlertTriangle, Clock, MessageCircle, ShieldAlert, Activity, Lightbulb, MapPin, Zap } from 'lucide-react';

const MOCK_EVENTS = [
  {
    id: 'e1',
    title: 'Đại nhạc hội EDM Sân vận động Hoa Lư',
    type: 'Music Festival',
    reach: '150K+',
    impactScore: '+85%',
    status: 'active',
    radarData: [
      { subject: 'Y tế (Medical)', A: 85, fullMark: 100 },
      { subject: 'Ăn uống (F&B)', A: 95, fullMark: 100 },
      { subject: 'Di chuyển (Transport)', A: 90, fullMark: 100 },
      { subject: 'An ninh (Security)', A: 70, fullMark: 100 },
    ],
    timeline: [
      { time: '20:00 PM', text: 'Sự kiện bắt đầu. Lưu lượng giao thông tăng 300% quanh ngã tư Đinh Tiên Hoàng.', type: 'traffic' },
      { time: '22:15 PM', text: 'AI phát hiện 500+ bài đăng nhắc đến "hết nước uống" và "khát" tại khu vực Cổng B.', type: 'social' },
      { time: '23:30 PM', text: 'Gia tăng đột biến tìm kiếm "nhà thuốc 24/24" và "giải rượu" trong bán kính 2km.', type: 'medical' },
    ],
    suggestion: 'Khuyến nghị điều phối thêm 5 xe cấp cứu túc trực tại Cổng A và Cổng C. Gửi thông báo đẩy (push notification) cho 12 nhà thuốc 24/7 trong bán kính 2km chuẩn bị thêm các sản phẩm giải rượu và nước bù điện giải.'
  },
  {
    id: 'e2',
    title: 'Lễ hội Bia Thủ công Thảo Điền',
    type: 'Food & Beverage',
    reach: '45K+',
    impactScore: '+60%',
    status: 'upcoming',
    radarData: [
      { subject: 'Y tế (Medical)', A: 60, fullMark: 100 },
      { subject: 'Ăn uống (F&B)', A: 100, fullMark: 100 },
      { subject: 'Di chuyển (Transport)', A: 75, fullMark: 100 },
      { subject: 'An ninh (Security)', A: 50, fullMark: 100 },
    ],
    timeline: [
      { time: '18:00 PM', text: 'Lượng check-in tại Thảo Điền tăng 150% so với cuối tuần trước.', type: 'social' },
      { time: '21:00 PM', text: 'Phát hiện nhiều từ khóa "say quá", "cần xe về" trên các nhóm cộng đồng.', type: 'social' },
    ],
    suggestion: 'Dự báo nhu cầu gọi xe công nghệ và taxi sẽ tăng vọt vào lúc 23:00. Cảnh báo các quán ăn đêm khu vực Quận 2 chuẩn bị nguyên liệu vì khách hàng sẽ tìm kiếm đồ ăn khuya sau sự kiện.'
  },
  {
    id: 'e3',
    title: 'Chung kết Bóng đá Phố đi bộ Nguyễn Huệ',
    type: 'Sports Event',
    reach: '250K+',
    impactScore: '+120%',
    status: 'active',
    radarData: [
      { subject: 'Y tế (Medical)', A: 95, fullMark: 100 },
      { subject: 'Ăn uống (F&B)', A: 85, fullMark: 100 },
      { subject: 'Di chuyển (Transport)', A: 100, fullMark: 100 },
      { subject: 'An ninh (Security)', A: 90, fullMark: 100 },
    ],
    timeline: [
      { time: '19:00 PM', text: 'Khu vực Phố đi bộ đã kẹt cứng. Các tuyến đường xung quanh ùn tắc nghiêm trọng.', type: 'traffic' },
      { time: '21:45 PM', text: 'Trận đấu kết thúc. Hàng chục ngàn người đổ ra các quán nhậu khu vực Quận 1 và Quận 4.', type: 'social' },
      { time: '22:30 PM', text: '15 ca cấp cứu vì chen lấn và say xỉn được ghi nhận tại Bệnh viện Quận 1.', type: 'medical' },
    ],
    suggestion: 'Báo động đỏ (Critical) cho toàn bộ hệ thống y tế và an ninh Quận 1. Kích hoạt luồng thông báo khẩn cấp cho các tài xế công nghệ tránh các tuyến đường trung tâm. Tăng cường nhân sự tại các phòng khám 24/7 lân cận.'
  }
];

export default function EventIntelligence() {
  const [selectedEventId, setSelectedEventId] = useState(MOCK_EVENTS[0].id);
  
  const activeEvent = MOCK_EVENTS.find(e => e.id === selectedEventId) || MOCK_EVENTS[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Zap className="text-orange-500" />
          Event Intelligence & Causal Analysis
        </h2>
        <p className="text-gray-500 mt-2">
          Phân tích mối quan hệ nhân quả giữa các sự kiện thực tế và sự biến động của Chỉ số Nhu cầu (Demand Index).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Event List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            Active & Upcoming Events
          </h3>
          
          <div className="space-y-4">
            {MOCK_EVENTS.map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                  selectedEventId === event.id 
                    ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500' 
                    : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{event.type}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    event.status === 'active' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {event.status === 'active' ? 'LIVE' : 'UPCOMING'}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h4>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Users size={16} />
                    <span className="font-medium">{event.reach}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-lg">
                    <TrendingUp size={16} />
                    <span>{event.impactScore} Impact</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Analysis & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Row: Radar Chart & AI Suggestion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Correlation Logic (Radar Chart) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Activity size={20} className="text-orange-500" />
                Correlation Logic
              </h3>
              <p className="text-xs text-gray-500 mb-4">Mức độ ảnh hưởng dự kiến lên các lĩnh vực</p>
              
              <div className="flex-1 min-h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={activeEvent.radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Impact"
                      dataKey="A"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.4}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Decision Recommendation */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-md text-white flex flex-col">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Lightbulb size={20} className="text-orange-100" />
                AI Decision Recommendation
              </h3>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 flex-1 border border-white/20">
                <p className="text-sm leading-relaxed font-medium">
                  {activeEvent.suggestion}
                </p>
              </div>
              
              <div className="mt-4 flex items-center gap-3">
                <button className="flex-1 bg-white text-orange-600 font-bold py-2.5 rounded-xl hover:bg-orange-50 transition-colors shadow-sm text-sm">
                  Approve & Execute
                </button>
                <button className="flex-1 bg-black/20 text-white font-bold py-2.5 rounded-xl hover:bg-black/30 transition-colors text-sm">
                  Modify Plan
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Row: Social Pulse Timeline */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageCircle size={20} className="text-blue-500" />
              Social Pulse Timeline
            </h3>
            
            <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
              {activeEvent.timeline.map((item, index) => (
                <div key={index} className="relative pl-8 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${index * 150}ms` }}>
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    item.type === 'traffic' ? 'bg-yellow-500' : 
                    item.type === 'medical' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400" />
                      {item.time}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider w-fit ${
                      item.type === 'traffic' ? 'bg-yellow-100 text-yellow-700' : 
                      item.type === 'medical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
