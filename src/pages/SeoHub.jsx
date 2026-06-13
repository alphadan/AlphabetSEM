import { useState } from 'react';
import { Search, Sparkles, BookOpen } from 'lucide-react';

export default function SeoHub() {
  const [keywordInput, setKeywordInput] = useState('');
  const [optimizedMeta, setOptimizedMeta] = useState(null);

  const handleGenerateMeta = (e) => {
    e.preventDefault();
    if (!keywordInput) return;
    
    setOptimizedMeta({
      title: `${keywordInput} | Custom Outdoor Commercial Signs | Alphabet Signs`,
      description: `Buy high-quality, weather-resistant ${keywordInput} made from premium materials. Direct manufacturer prices, lifetime guarantees, and fast shipping on all commercial sign letters. Design yours today!`,
      tags: ['outdoor signs', 'dimensional lettering', 'building letters', 'storefront signage']
    });
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SEO Hub</h1>
        <p className="text-slate-500 mt-1">Google Search Console CTR Optimizer and Smart Metadata Generator</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-slate-950 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" /> AI Meta Tag & CTR Generator
            </h2>
            <p className="text-sm text-slate-600">
              Input a target keyword or high-impression / low-CTR query from Search Console. Gemini will write optimized titles and meta descriptions designed to drive buying intent.
            </p>
            
            <form onSubmit={handleGenerateMeta} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Target SEO Keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="e.g., Cast Aluminum Building Letters"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-sm active:scale-98 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="h-4 w-4" /> Draft Meta Data with Gemini
              </button>
            </form>
          </div>

          {optimizedMeta && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                Optimized Meta Draft
              </h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Title Tag ({optimizedMeta.title.length} characters)</span>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-blue-600 select-all">
                    {optimizedMeta.title}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Meta Description ({optimizedMeta.description.length} characters)</span>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed select-all">
                    {optimizedMeta.description}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" /> SEO Checklist
            </h3>
            <ul className="space-y-4 text-xs">
              <li className="space-y-1">
                <strong className="text-slate-800 block">1. Product Schema</strong>
                <p className="text-slate-500 leading-relaxed">
                  Add rich structured Product snippets to rank star ratings and material specifications directly in the SERP.
                </p>
              </li>
              <li className="space-y-1">
                <strong className="text-slate-800 block">2. Fast Sizing Tool</strong>
                <p className="text-slate-500 leading-relaxed">
                  Provide instant sizing and templates to keep design specifiers on-page longer, improving organic dwell metrics.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
