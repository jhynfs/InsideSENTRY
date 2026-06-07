import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  RotateCcw,
  ScrollText,
  Search,
  BarChart3,
  Download,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from '../../imports/Asset_Tracking_Logo_V2.png';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Issue Equipment', path: '/issue', icon: FileText },
    { name: 'Returns', path: '/returns', icon: RotateCcw },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Audit Logs', path: '/audit', icon: ScrollText },
    { name: 'Backup/Restore', path: '/backup', icon: Download },
  ];

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center">
            <ImageWithFallback src={logo} alt="2SBn SENTRY Logo" className="h-8 mr-2" />
            <div>
              <h1 className="text-white">2SBn SENTRY</h1>
              <p className="text-xs text-slate-400">Asset Tracking System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 mb-2 rounded transition-colors ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
