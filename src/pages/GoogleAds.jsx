import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import ApprovalCard from '../components/ApprovalCard';

export default function GoogleAds() {
  const [recommendations, setRecommendations] = useState([
    {
      id: 'bleed-pmax',
      title: 'PMax "Alphabet & Kids" Trap Exclusions',
      type: 'Negative Keywords',
      impact: 'high',
      desc: 'Google PMax matched terms like "abcdefghijkl" and "letter r jack hartmann" (kids educational content). We need to create a Brand Exclusion list including "kids", "classroom", "kindergarten", "toys", "abc song".',
      costSavings: '~$1,200/mo',
      difficulty: 'Easy (5 mins)'
    },
    {
      id: 'building-letters-bidding',
      title: 'Change Bidding on Building Letters Search',
      type: 'Bidding Strategy',
      impact: 'high',
      desc: 'Switch "Building Letters | Search" campaign from Target Impression Share to Maximize Conversions (Target CPA $80). Currently operating at a poor 0.76 ROAS and astronomical $339 Cost Per Conversion.',
      costSavings: '~$900/mo',
      difficulty: 'Medium (10 mins)'
    },
    {
      id: 'demand-gen-pause',
      title: 'Pause Underperforming Demand Gen Campaign',
      type: 'Campaign Control',
      impact: 'medium',
      desc: 'Demand Gen campaign spent $1,781.71 but returned only $551.70 (0.31 ROAS). Either pause entirely to reallocate budget or lock targeting down exclusively to past purchasers lists.',
      costSavings: '~$1,780/mo',
      difficulty: 'Easy (2 mins)'
    }
  ]);

  const [appliedActions, setAppliedActions] = useState([]);

  const handleApprove = (id) => {
    setRecommendations(recommendations.filter(r => r.id !== id));
    setAppliedActions([...appliedActions, { id, status: 'approved' }]);
  };

  const handleReject = (id) => {
    setRecommendations(recommendations.filter(r => r.id !== id));
    setAppliedActions([...appliedActions, { id, status: 'rejected' }]);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Google Ads Dashboard</h1>
        <p className="text-slate-500 mt-1">Audit, Optimization Bids, and Brand Exclusions Automation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="space-y-1 border-r border-slate-800 pr-6">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Account Diagnostics</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-lg font-bold text-red-400">2 Critical Leaks Detected</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">High-leeway matching in PMax and impression share over-bidding are draining cash.</p>
        </div>
        <div className="space-y-1 md:border-r border-slate-800 md:px-6">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top Performing Asset</span>
          <h4 className="text-base font-bold text-emerald-400 mt-1">PMax Marquee Lettering</h4>
          <p className="text-xs text-slate-300 mt-1">Generated $9,739.09 in sales on $4,045.00 spend (2.41 ROAS).</p>
        </div>
        <div className="space-y-1 md:pl-6">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Monthly Savings Potential</span>
          <h2 className="text-3xl font-extrabold text-emerald-400 mt-1">$3,880.00</h2>
          <p className="text-xs text-emerald-500/80 font-medium">By implementing suggested negative exclusions and swapping bids.</p>
        </div>
      </div>

      <div className="space-y-5">
        <h2 className="text-xl font-bold text-slate-900">Gemini-Generated Optimizations</h2>
        
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <ApprovalCard 
                key={rec.id} 
                recommendation={rec} 
                onApprove={handleApprove} 
                onReject={handleReject} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center max-w-xl mx-auto space-y-3">
            <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-950">All recommendations processed!</h3>
            <p className="text-sm text-emerald-700 leading-relaxed">
              Your Google Ads account is locked down tight. Wait for the daily BigQuery sync for new insights.
            </p>
          </div>
        )}
      </div>

      {appliedActions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Action Queue History</h3>
          <ul className="divide-y divide-slate-100 text-xs">
            {appliedActions.map((action, i) => (
              <li key={i} className="py-2.5 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Action ID: {action.id}</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                  action.status === 'approved' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {action.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
