import { useState } from 'react';
import { Mail, Sparkles, Copy, Check } from 'lucide-react';

export default function EmailHub() {
  const [topic, setTopic] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [options, setOptions] = useState([]);

  const handleGenerateSubjectLines = (e) => {
    e.preventDefault();
    if (!topic) return;

    setOptions([
      { subject: `🚪 Finish setting up your storefront sign? (Get 10% off)`, recoveryRate: '+12.4% Est. recovery rate' },
      { subject: `Don't leave your building blank! Custom letters inside.`, recoveryRate: '+9.8% Est. recovery rate' },
      { subject: `📐 Need sizing help? Talk to an Alphabet Signs design expert today.`, recoveryRate: '+15.2% Est. recovery rate' }
    ]);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Email Hub</h1>
        <p className="text-slate-500 mt-1">E-Commerce Flow Optimization & Abandoned Cart Recovery Helpers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-slate-950 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" /> Abandoned Cart Copy Optimizer
            </h2>
            <p className="text-sm text-slate-600">
              Create highly compelling subject lines to recover customers who left high-value sign letters in their shopping carts.
            </p>

            <form onSubmit={handleGenerateSubjectLines} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  What did they leave behind?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Cast metal letters, Marquee signs"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-sm active:scale-98 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="h-4 w-4" /> Generate Subject Lines
              </button>
            </form>
          </div>

          {options.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Recommended Subject Lines</h3>
              <div className="space-y-3">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-50/50 transition gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-950">{opt.subject}</p>
                      <span className="text-[11px] font-semibold text-emerald-600 block">{opt.recoveryRate}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(opt.subject, i)}
                      className="shrink-0 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      {copiedIndex === i ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Cart Best Practices
            </h3>
            <ul className="space-y-4 text-xs text-slate-600">
              <li className="space-y-1">
                <strong className="text-slate-800 block">⏰ First Touch Timing</strong>
                <p className="leading-relaxed">
                  Fire the first recovery email within 45 minutes of a cart drop. Offer instant design and sizing help to lower friction!
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
