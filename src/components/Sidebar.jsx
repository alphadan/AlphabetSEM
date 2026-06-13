import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Search, 
  Mail, 
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Google Ads', path: '/google-ads', icon: TrendingUp },
    { name: 'SEO Hub', path: '/seo-hub', icon: Search },
    { name: 'Email Hub', path: '/email-hub', icon: Mail },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 z-10">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none tracking-tight">AlphabetSEM</h1>
          <span className="text-xs text-slate-400 font-medium">Internal MarTech</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-center">
        <p className="text-[11px] text-slate-500 font-medium">Alphabet Signs © 2026</p>
        <p className="text-[9px] text-slate-600 mt-0.5">v1.0.0-Beta</p>
      </div>
    </aside>
  );
}
