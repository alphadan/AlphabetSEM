import { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Sparkles, 
  ShoppingBag,
  ArrowUpRight,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [metrics] = useState({
    spend: '$29,856.00',
    conversionValue: '$57,324.44',
    roas: '1.92',
    conversions: '430.25',
    avgCpa: '$69.39'
  });

  const channels = [
    {
      name: 'Google Ads Search & PMax',
      status: 'Active Audit',
      roas: '1.92',
      cost: '$29,856.00',
      sales: '$57,324.44',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      desc: 'Active spend on branded campaigns, building letters, and PMax Marquee.',
      link: '/google-ads'
    },
    {
      name: 'Search Console SEO',
      status: 'Ready to Audit',
      roas: 'N/A',
      cost: 'Organic ($0)',
      sales: 'GSC Traffic',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Optimize CTR for metal lettering terms and schema structures.',
      link: '/seo-hub'
    },
    {
      name: 'Email Marketing Flows',
      status: 'Drafting Prompts',
      roas: 'Est. 4.50',
      cost: 'Subscription',
      sales: 'Recoveries',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      desc: 'Klaviyo abandoned cart audits & subject line split tests.',
      link: '/email-hub'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AlphabetSEM Dashboard</h1>
          <p className="text-slate-500 mt-1">Multi-Channel Search Engine Marketing & Conversion Intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-xs font-semibold text-slate-600 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Data Sync Live
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm">
            <Sparkles className="h-4 w-4" /> Run Gemini Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase">Total Spend</span>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{metrics.spend}</p>
          <span className="text-[11px] text-slate-400 font-medium">May 13 – Jun 11</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase">Sales Value</span>
            <ShoppingBag className="h-4 w-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{metrics.conversionValue}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" /> +14.2% MoM
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase">Account ROAS</span>
            <Percent className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{metrics.roas}</p>
          <span className="text-[11px] text-slate-500 font-medium">Target: &gt; 2.50</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase">Conversions</span>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{metrics.conversions}</p>
          <span className="text-[11px] text-slate-400 font-medium">Avg Value: $133.23</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase">Avg CPA</span>
            <TrendingDown className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{metrics.avgCpa}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Reduced by 8.4%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Active Marketing Channels</h2>
          <div className="space-y-4">
            {channels.map((channel, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900 text-lg">{channel.name}</h3>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${channel.badgeColor}`}>
                      {channel.status}
                    </span>
                  </div>
                  <Link 
                    to={channel.link}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Manage Hub <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  {channel.desc}
                </p>
                <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">ROAS</span>
                    <strong className="text-slate-800 text-sm">{channel.roas}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Cost</span>
                    <strong className="text-slate-800 text-sm">{channel.cost}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Sales / Focus</span>
                    <strong className="text-slate-800 text-sm">{channel.sales}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Optimization Log</h2>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <ul className="space-y-4 text-xs">
              <li className="flex gap-3">
                <span className="text-slate-400 shrink-0 font-semibold w-12">Jun 11</span>
                <div>
                  <strong className="text-slate-800 block">Negative Brand Keywords Excluded</strong>
                  <p className="text-slate-500 mt-0.5">Paused phrase match """alphabet signs""" and added exclusions for schools and bulletin board terms.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-400 shrink-0 font-semibold w-12">Jun 10</span>
                <div>
                  <strong className="text-slate-800 block">PMax Target ROAS Check</strong>
                  <p className="text-slate-500 mt-0.5">PMax Marquee signs performing solid at 2.41 ROAS. Asset groups flag limitations.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-400 shrink-0 font-semibold w-12">Jun 01</span>
                <div>
                  <strong className="text-slate-800 block">Platform Setup Launched</strong>
                  <p className="text-slate-500 mt-0.5">AlphabetSEM project structure conceptualized and approved by engineering.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
