'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Briefcase, Settings2, Sparkles, LogOut, Menu, X, ArrowLeft, Coins } from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: any;
  active: boolean;
}

function SidebarLink({ href, label, icon: Icon, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3.5 px-4 py-3 rounded-lg text-sm tracking-wide transition-all duration-300 ${
        active
          ? 'bg-[#0033A0] text-white font-semibold shadow-sm'
          : 'text-slate-600 hover:bg-gray-100 hover:text-slate-800'
      }`}
    >
      <Icon className={`w-4.5 h-4.5 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ username: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Get logged-in user profile
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.user);
        } else {
          router.push('/admin');
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const menuItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Konsultasi Client', href: '/admin/dashboard/consultations', icon: FileText },
    { label: 'Portfolio Works', href: '/admin/dashboard/portfolio', icon: Briefcase },
    { label: 'Harga Layanan', href: '/admin/dashboard/services', icon: Settings2 },
    { label: 'Smart Pricing System', href: '/admin/dashboard/pricing', icon: Coins },
    { label: 'Update & Promo', href: '/admin/dashboard/offers', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 flex flex-col lg:flex-row">
      
      {/* Mobile Top Navbar */}
      <header className="lg:hidden bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Rencana Tuhan Studio"
            className="h-8 w-auto object-contain"
          />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-600 hover:text-slate-850"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between transition-all duration-300 z-30 lg:z-10 shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-10">
          
          {/* Logo Brand */}
          <div className="hidden lg:flex items-center">
            <img
              src="/logo.png"
              alt="Rencana Tuhan Studio"
              className="h-9 w-auto object-contain"
            />
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <SidebarLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={pathname === item.href}
              />
            ))}
          </nav>
        </div>

        {/* User Info / Logout Panel */}
        <div className="space-y-6">
          <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">ADMIN SESSION</span>
              <span className="text-xs font-semibold text-slate-700 truncate">
                {adminUser?.username || 'Administrator'}
              </span>
            </div>
            <Link
              href="/"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-all"
              title="Ke Beranda Website"
            >
              <ArrowLeft size={16} />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-750 transition-all duration-300"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span className="tracking-wide font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Sidebar overlay backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          />
        )}

        <main className="flex-1 p-6 lg:p-12 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      
    </div>
  );
}
