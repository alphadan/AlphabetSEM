import { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Terminal, 
  Cloud, 
  Settings, 
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function Help() {
  const [activeTab, setActiveTab] = useState('getting-started');

  const cliCommands = [
    { cmd: 'node scripts/test_key.js', desc: 'Tests your .env Gemini API key and prints all active models available on your Google account.' },
    { cmd: 'node scripts/parse_search_terms.js', desc: 'Scans raw Google Ads reports, isolating exact spend wasted on toddler keyboard spam and irrelevant search queries.' },
    { cmd: 'node scripts/gemini_analyst.js', desc: 'Queries Gemini 2.5 Flash to automatically output a structured JSON recommendation package complete with exclusions and false-positive shields.' },
    { cmd: 'node scripts/parse_search_console.js', desc: 'Parses Search Console queries, compiling high-volume queries with low click-through rates (CTR) to load as optimization opportunities.' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <HelpCircle className="h-7 w-7 text-blue-600 shrink-0" />
          Documentation & Help Hub
        </h1>
        <p className="text-slate-500 mt-1">Platform Architecture, Setup Guides, CLI Commands, and Cloud Deployment Manuals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'overview' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Overview</span>
            <ChevronRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setActiveTab('getting-started')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'getting-started' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><Settings className="h-4 w-4" /> Getting Started</span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'cli' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><Terminal className="h-4 w-4" /> CLI Utilities</span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'cloud' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2"><Cloud className="h-4 w-4" /> Cloud Deployment</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-100 pb-3">Platform Overview</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                AlphabetSEM is a proprietary Marketing Technology command center built specifically for <strong>Alphabet Signs</strong>. It integrates developers' serverless infrastructure directly with the raw analytical power of <strong>Gemini 2.5 Flash</strong> and automated <strong>BigQuery Data Warehouses</strong>.
              </p>
              
              <h3 className="font-extrabold text-slate-900 text-base pt-2">🌟 Multi-Channel Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">🛒 Google Ads Dashboard</strong>
                  <p className="leading-relaxed">Reviews, approves, or rejects negative keywords to stop Performance Max leaking budget into keyboard spam.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">🌐 Organic SEO Hub</strong>
                  <p className="leading-relaxed">Audits Search Console logs to auto-draft CTR-optimized title tags, meta descriptions, and HTML Product schemas.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Getting Started */}
          {activeTab === 'getting-started' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-100 pb-3">Getting Started Guide</h2>
              
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm">1. Install Dependencies</h3>
                <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
{`# Install frontend packages
npm install

# Install Cloud Functions packages
cd functions && npm install && cd ..`}
                </pre>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="font-extrabold text-slate-900 text-sm">2. Configure Environment Variables</h3>
                <p className="text-xs text-slate-500">Create a file named <code>.env</code> in your root directory and paste your configuration credentials:</p>
                <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
{`# Firebase Connections
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=alphabetsem

# Gemini Developer Key
VITE_GEMINI_API_KEY=your_gemini_api_key`}
                </pre>
              </div>
            </div>
          )}

          {/* Tab 3: CLI Utilities */}
          {activeTab === 'cli' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-100 pb-3">Developer CLI Utilities</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                Your workspace contains several fast, zero-dependency Node.js CLI tools located inside your <code>scripts/</code> directory:
              </p>

              <div className="space-y-4 divide-y divide-slate-100">
                {cliCommands.map((item, i) => (
                  <div key={i} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-mono">
                        {item.cmd}
                      </code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(item.cmd)}
                        className="text-[10px] font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Cloud Deployment */}
          {activeTab === 'cloud' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-100 pb-3">Cloud Backend Deployment</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                Your backend is hosted on <strong>Firebase Cloud Functions</strong> utilizing the modern <strong>Node.js 22</strong> runtime.
              </p>

              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm">1. Set API Secrets in Google Secret Manager</h3>
                <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
                  firebase functions:secrets:set GEMINI_API_KEY
                </pre>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="font-extrabold text-slate-900 text-sm">2. Deploy Scheduled Cron Audits</h3>
                <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
                  firebase deploy --only functions
                </pre>
                <p className="text-[11px] text-slate-400">
                  *This registers the daily audit, configured to execute on a background cron schedule at 2:00 AM New York time.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Minimal inline Copy icon utility
function Copy({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  );
}
