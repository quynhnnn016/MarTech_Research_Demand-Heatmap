import React, { useState, useEffect } from 'react';
import { Database, Server, Smartphone, Brain, ArrowRight, Activity, Map, Search, MessageSquare, Zap, Layers, Cpu, Map as MapIcon } from 'lucide-react';

export default function Architecture() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [dataFlow, setDataFlow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlow(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const nodes = {
    sources: {
      id: 'sources',
      title: 'Data Sources',
      icon: <MessageSquare size={24} className="text-blue-500" />,
      desc: 'Real-time ingestion from Social Media (Facebook, TikTok) and Check-ins.',
      color: 'border-blue-200 bg-blue-50',
      textColor: 'text-blue-700'
    },
    nlp: {
      id: 'nlp',
      title: 'NLP & Sentiment',
      icon: <Brain size={24} className="text-purple-500" />,
      desc: 'Analyzes text to detect intent (e.g., "hangover", "party") and sentiment.',
      color: 'border-purple-200 bg-purple-50',
      textColor: 'text-purple-700'
    },
    scoring: {
      id: 'scoring',
      title: 'Scoring Engine',
      icon: <Activity size={24} className="text-orange-500" />,
      desc: 'Calculates Spatial Demand Index based on NLP output, time, and location.',
      color: 'border-orange-200 bg-orange-50',
      textColor: 'text-orange-700'
    },
    output: {
      id: 'output',
      title: 'Client UI (Map)',
      icon: <Map size={24} className="text-green-500" />,
      desc: 'Renders heatmaps and triggers push notifications to drivers.',
      color: 'border-green-200 bg-green-50',
      textColor: 'text-green-700'
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in duration-500">
      
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Layers className="text-orange-500" />
            System Architecture & Data Flow
          </h2>
          <p className="text-gray-500 mt-2">Interactive diagram showing how raw social data is transformed into actionable demand hotspots.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 py-12">
            
            {/* Node 1: Sources */}
            <DiagramNode 
              node={nodes.sources} 
              isActive={activeNode === 'sources'} 
              isFlowing={dataFlow === 0}
              onClick={() => setActiveNode('sources')} 
            />

            {/* Flow Arrow 1 */}
            <FlowArrow active={dataFlow === 0 || dataFlow === 1} />

            {/* Node 2: NLP */}
            <DiagramNode 
              node={nodes.nlp} 
              isActive={activeNode === 'nlp'} 
              isFlowing={dataFlow === 1}
              onClick={() => setActiveNode('nlp')} 
            />

            {/* Flow Arrow 2 */}
            <FlowArrow active={dataFlow === 1 || dataFlow === 2} />

            {/* Node 3: Scoring */}
            <DiagramNode 
              node={nodes.scoring} 
              isActive={activeNode === 'scoring'} 
              isFlowing={dataFlow === 2}
              onClick={() => setActiveNode('scoring')} 
            />

            {/* Flow Arrow 3 */}
            <FlowArrow active={dataFlow === 2 || dataFlow === 3} />

            {/* Node 4: Output */}
            <DiagramNode 
              node={nodes.output} 
              isActive={activeNode === 'output'} 
              isFlowing={dataFlow === 3}
              onClick={() => setActiveNode('output')} 
            />

          </div>

          {/* Details Panel */}
          <div className="mt-12 bg-gray-50 border border-gray-200 rounded-2xl p-6 min-h-[160px] transition-all duration-300">
            {activeNode ? (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 mb-2">
                  {nodes[activeNode as keyof typeof nodes].icon}
                  <h3 className={`text-lg font-bold ${nodes[activeNode as keyof typeof nodes].textColor}`}>
                    {nodes[activeNode as keyof typeof nodes].title}
                  </h3>
                </div>
                <p className="text-gray-600">{nodes[activeNode as keyof typeof nodes].desc}</p>
                
                {/* Mock Code Snippet based on active node */}
                <div className="mt-4 bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                  {activeNode === 'sources' && `// Listening to firehose...\nconst stream = await SocialAPI.connect({ keywords: ['party', 'hangover', 'sick'] });\nstream.on('data', (post) => ingestQueue.push(post));`}
                  {activeNode === 'nlp' && `// Processing text...\nconst sentiment = await Gemini.analyze(post.text);\nif (sentiment.intent === 'hangover_cure') {\n  flagForPharmacy(post.location);\n}`}
                  {activeNode === 'scoring' && `// Calculating index...\nconst baseDemand = calculateBase(location);\nconst socialMultiplier = getSocialWeight(timeWindow);\nconst finalIndex = baseDemand * socialMultiplier;\nupdateHotspot(location, finalIndex);`}
                  {activeNode === 'output' && `// Updating UI...\nws.send(JSON.stringify({ type: 'HOTSPOT_UPDATE', data: newHotspots }));\nif (finalIndex > threshold) triggerPushNotification();`}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Zap size={24} className="mb-2 opacity-50" />
                <p>Click on any node in the diagram above to view detailed processing logic.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-orange-500">
          <Cpu />
          Data Processing Logic
        </h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <ul className="space-y-4 text-gray-600 leading-relaxed">
            <li><strong className="text-gray-900">Data Cleansing:</strong> Loại bỏ Stop Words, Noise, Spam từ hội thoại thô.</li>
            <li><strong className="text-gray-900">Keyword Extraction:</strong> Trích xuất các thực thể (Entities) liên quan đến "quán nhậu", "say xỉn", "mệt mỏi", "giải rượu", "Beer Club", "Pub".</li>
            <li><strong className="text-gray-900">Sentiment Analysis:</strong> Phân loại cảm xúc (Positive, Neutral, Negative). Các đánh giá tiêu cực về tình trạng sức khỏe sau khi uống rượu (ví dụ: "đau đầu", "buồn nôn") sẽ được gán trọng số (Weight) cao hơn.</li>
            <li><strong className="text-gray-900">Demand Index Calculation:</strong> Chỉ số nhu cầu (Demand Index) = (Tần suất Keyword * Trọng số Keyword) + (Điểm Sentiment * Trọng số Sentiment) + (Check-in Volume * Trọng số Thời gian). Trọng số thời gian tăng cao vào các khung giờ đêm (22:00 - 02:00).</li>
            <li><strong className="text-gray-900">Geocoding & Aggregation:</strong> Map các Demand Index vào tọa độ (Latitude, Longitude) và gom cụm (Clustering) theo lưới không gian (Spatial Grid) hoặc H3 Hexagon.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-orange-500">
          <Server />
          Implementation Roadmap
        </h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-orange-500 bg-white text-orange-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Phase 1: MVP (Month 1-2)</h3>
                <p className="text-sm text-gray-600">Xây dựng Data Pipeline cơ bản với Google Places API và Facebook Graph API. Triển khai thuật toán NLP cơ bản (Rule-based Keyword Extraction). Xây dựng UI Dashboard với Heat Map tĩnh.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Phase 2: Advanced Analytics (Month 3-4)</h3>
                <p className="text-sm text-gray-600">Nâng cấp NLP Pipeline với Machine Learning Models (BERT/PhoBERT) để tăng độ chính xác của Sentiment Analysis. Tích hợp Real-time Streaming. Thêm tính năng Time-series Forecasting.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Phase 3: Commercialization & Scale (Month 5-6)</h3>
                <p className="text-sm text-gray-600">Tối ưu hóa hiệu năng Rendering với WebGL cho hàng triệu điểm dữ liệu. Phát triển Mobile App cho đội ngũ Sales/Distribution. Tích hợp thêm các nguồn dữ liệu khác.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

function DiagramNode({ node, isActive, isFlowing, onClick }: { node: any, isActive: boolean, isFlowing: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center w-32 md:w-40 transition-all duration-300 group ${isActive ? 'scale-110' : 'hover:scale-105'}`}
    >
      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 flex items-center justify-center shadow-sm transition-all duration-300 z-10 relative bg-white
        ${isActive ? node.color + ' shadow-md' : 'border-gray-200'}
      `}>
        {node.icon}
        
        {/* Pulse effect when flowing */}
        {isFlowing && (
          <span className={`absolute inset-0 rounded-2xl animate-ping opacity-20 ${node.color.split(' ')[0].replace('border-', 'bg-')}`}></span>
        )}
      </div>
      <div className={`mt-3 text-sm font-medium text-center transition-colors ${isActive ? node.textColor : 'text-gray-600'}`}>
        {node.title}
      </div>
    </button>
  );
}

function FlowArrow({ active }: { active: boolean }) {
  return (
    <div className="hidden md:flex flex-1 items-center justify-center relative h-20">
      <div className="w-full h-0.5 bg-gray-200 absolute top-1/2 -translate-y-1/2"></div>
      
      {/* Animated Flow Line */}
      <div className={`absolute top-1/2 -translate-y-1/2 left-0 h-0.5 bg-orange-500 transition-all duration-500 ${active ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
      
      {/* Animated Dot */}
      {active && (
        <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-[flow_1.5s_linear_infinite]"></div>
      )}
      
      <ArrowRight size={16} className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white text-gray-300 z-10 transition-colors ${active ? 'text-orange-500' : ''}`} />
      
      <style>{`
        @keyframes flow {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
