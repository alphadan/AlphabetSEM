import { Check, X, AlertTriangle, Zap } from 'lucide-react';

export default function ApprovalCard({ recommendation, onApprove, onReject }) {
  const { id, title, type, impact, desc, costSavings, difficulty } = recommendation;

  const badgeStyles = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <div className="border border-slate-200 rounded-xl p-5 shadow-sm transition-all bg-white hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyles[impact] || 'bg-slate-100 text-slate-800'}`}>
            {impact.toUpperCase()} IMPACT
          </span>
          {costSavings && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Est. Savings: {costSavings}
            </span>
          )}
        </div>

        <h3 className="font-bold text-slate-950 text-base mb-2 flex items-start gap-2">
          {impact === 'high' ? (
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          ) : (
            <Zap className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          )}
          {title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {desc}
        </p>
      </div>

      <div className="border-t border-slate-100 pt-4 mt-auto">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>Difficulty: <strong className="text-slate-700">{difficulty}</strong></span>
          <span>Category: <strong className="text-slate-700">{type}</strong></span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onReject(id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition"
          >
            <X className="h-3.5 w-3.5" /> Reject
          </button>
          <button
            onClick={() => onApprove(id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold active:scale-98 transition shadow-sm"
          >
            <Check className="h-3.5 w-3.5" /> Approve
          </button>
        </div>
      </div>
    </div>
  );
}
