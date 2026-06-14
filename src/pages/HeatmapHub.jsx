import { useState } from 'react';
import { Sparkles, Eye, ShieldAlert, CheckCircle, RefreshCw, Layers, Compass, HelpCircle } from 'lucide-react';

export default function HeatmapHub() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  
  // Simulated storefront click coordinates parsed from Firestore
  const [clicks] = useState([
    { x: 50, y: 15, strength: 'high', label: 'Primary Navigation Search' },
    { x: 30, y: 45, strength: 'high', label: 'Cast Metal Letters Card' },
    { x: 70, y: 45, strength: 'medium', label: 'Plastic Letters Card' },
    { x: 50, y: 75, strength: 'high', label: 'Muted Promo Banner' },
    { x: 85, y: 15, strength: 'low', label: 'Cart Icon' },
    { x: 15, y: 65, strength: 'medium', label: 'Sidebar Filter Sizing' },
    { x: 42, y: 88, strength: 'low', label: 'Rage Click: Non-clickable bullet point' }
  ]);

  const handleGenerateAudit = async () => {
    setLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey.startsWith('your_')) {
      setTimeout(() => {
        setRecommendations({
          summary: "Your Homepage CTA click ratio is unbalanced. While search and Cast Metal Letters have high engagement, the promo banner at the bottom is receiving clicks but has a 0% conversion rate, indicating high friction or confusing copy.",
          uxAudits: [
            { id: 1, element: "Bottom Promo Banner", issue: "Click Bleed / Confusing Action", advice: "The banner has high click heat, but users are bounce-clicking. Change the background color to high-contrast blue and make the CTA copy explicit: 'Download Sizing PDF Template'." },
            { id: 2, element: "Product Card Layout", issue: "Skewed Click Weight", advice: "Users are clicking 'Cast Metal Letters' 3x more than 'Formed Plastic'. Swapping card slots to place Formed Plastic on the left will lift secondary line conversions by 14%." }
          ]
        });
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const prompt = `
        You are an elite E-commerce UX Designer and Conversion Rate Optimizer for 'Alphabet Signs'.
        Analyze the click coordinates mapped from our Homepage:
        ${JSON.stringify(clicks)}
        
        Write an actionable UX/UI audit in this exact JSON structure:
        {
          "summary": "Brief visual summary explaining user behavior.",
          "uxAudits": [
            { "id": 1, "element": "Element Name", "issue": "Specific Friction Issue", "advice": "Actionable layout advice" }
          ]
        }
      `;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const responseData = await res.json();
      let text = responseData.candidates[0].content.parts[0].text.trim();
      text = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      
      const parsed = JSON.parse(text);
      setRecommendations(parsed);
    } catch (error) {
      console.error('Heatmap UX Audit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Eye className="h-7 w-7 text-blue-600 shrink-0" />
            Visual Heatmap Hub
          </h1>
          <p className="text-slate-500 mt-1">Lightweight Storefront Click Tracking Overlay & Gemini UX Optimizer</p>
        </div>
        <button 
          onClick={handleGenerateAudit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          {loading ? 'Analyzing UX...' : <><Sparkles className="h-4 w-4" /> Run Gemini UX Audit</>}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Storefront Wireframe Mockup with Glowing CSS click hotspots! */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Homepage Click Density Map</h2>
          
          {/* Wireframe Box */}
          <div className="relative aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between p-6">
            
            {/* Nav Bar Wireframe */}
            <div className="h-10 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Logo</span>
              <div className="flex gap-4"><span>Search</span><span>Products</span><span>Cart</span></div>
            </div>

            {/* Content Cards Wireframe */}
            <div className="grid grid-cols-2 gap-4 my-auto h-32">
              <div className="bg-slate-900/30 rounded-xl border border-slate-800/80 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                Cast Metal Letters
              </div>
              <div className="bg-slate-900/30 rounded-xl border border-slate-800/80 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                Formed Plastic Letters
              </div>
            </div>

            {/* Bottom Promo Wireframe */}
            <div className="h-12 bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
              10% Off Signicade Sidewalk Signs Promo Banner
            </div>

            {/* GLOWING HEATMAP DOT OVERLAYS (Radial Gradients!) */}
            {clicks.map((click, i) => {
              const bgStyle = click.strength === 'high' 
                ? 'radial-gradient(circle, rgba(239,68,68,1) 0%, rgba(239,68,68,0) 70%)'
                : click.strength === 'medium'
                ? 'radial-gradient(circle, rgba(245,158,11,1) 0%, rgba(245,158,11,0) 70%)'
                : 'radial-gradient(circle, rgba(59,130,246,1) 0%, rgba(59,130,246,0) 70%)';

              return (
                <div
                  key={i}
                  className="absolute rounded-full pointer-events-auto cursor-help group"
                  style={{
                    left: `${click.x}%`,
                    top: `${click.y}%`,
                    width: click.strength === 'high' ? '60px' : click.strength === 'medium' ? '45px' : '30px',
                    height: click.strength === 'high' ? '60px' : click.strength === 'medium' ? '45px' : '30px',
                    transform: 'translate(-50%, -50%)',
                    background: bgStyle,
                  }}
                >
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 border border-slate-800 text-[10px] font-bold text-white px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none">
                    {click.label} ({click.strength.toUpperCase()})
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Gemini UX Optimizations</h2>

          {recommendations ? (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl space-y-2">
                <h3 className="font-extrabold text-blue-950 text-sm">Visual Behavior Summary</h3>
                <p className="text-xs text-blue-900 leading-relaxed font-medium">
                  {recommendations.summary}
                </p>
              </div>

              <div className="space-y-3">
                {recommendations.uxAudits.map((audit) => (
                  <div key={audit.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full uppercase">
                        Layout Issue
                      </span>
                      <span className="text-xs font-bold text-slate-400">Target: {audit.element}</span>
                    </div>
                    <strong className="text-sm font-black text-slate-950 block">{audit.issue}</strong>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                      💡 {audit.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4">
              <Compass className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-950">No Active Audit Loaded</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click "Run Gemini UX Audit" at the top to have Gemini analyze your click coordinates, element properties, and landing page wireframes!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
