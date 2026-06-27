'use client';

import { useState, useEffect } from 'react';
import { Users, FileSpreadsheet, Activity, TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import { formatIDR } from '@/lib/calculator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Metrics {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  totalOmzet: number;
}

interface ChartData {
  monthlyRevenue: { name: string; omzet: number }[];
  popularServices: { name: string; value: number; revenue: number }[];
  statusBreakdown: { name: string; value: number }[];
}

export default function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount check for Recharts hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  async function fetchAnalytics(showRefresh = false) {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setCharts(data.charts);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ['#0033A0', '#FDB913', '#3B82F6', '#10B981', '#6366F1'];

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center space-x-2 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin text-[#0033A0]" />
        <span className="text-sm tracking-wider">Memuat data analitik...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 tracking-wide">
            Overview Analytics
          </h1>
          <p className="text-slate-450 text-xs md:text-sm font-light mt-1">
            Pantau ringkasan omzet, status project, dan statistik konsultasi terupdate.
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          className="flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold border border-gray-200 px-4 py-2.5 rounded bg-white hover:bg-gray-50 text-slate-700 hover:text-slate-900 shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#0033A0]' : ''}`} />
          <span>REFRESH</span>
        </button>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Customer Base */}
          <div className="glass-panel p-6 rounded-xl shadow-sm flex items-center justify-between bg-white">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                Total Client
              </span>
              <span className="text-2xl font-bold text-slate-800 tracking-wide">
                {metrics.totalClients}
              </span>
              <span className="text-[10px] text-slate-400 block">Jumlah WhatsApp Unik</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Consultations */}
          <div className="glass-panel p-6 rounded-xl shadow-sm flex items-center justify-between bg-white">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                Total Request
              </span>
              <span className="text-2xl font-bold text-slate-800 tracking-wide">
                {metrics.totalProjects}
              </span>
              <span className="text-[10px] text-slate-400 block">Semua Pengajuan Konsultasi</span>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg text-purple-600">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Active projects */}
          <div className="glass-panel p-6 rounded-xl shadow-sm flex items-center justify-between bg-white">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                Project Berjalan
              </span>
              <span className="text-2xl font-bold text-slate-800 tracking-wide">
                {metrics.activeProjects}
              </span>
              <span className="text-[10px] text-slate-400 block">Status Review/Nego/Approved</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-[#FDB913]">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Revenue */}
          <div className="glass-panel p-6 rounded-xl shadow-sm flex items-center justify-between bg-white">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                Total Omzet
              </span>
              <span className="text-2xl font-bold text-slate-800 tracking-wide">
                {formatIDR(metrics.totalOmzet)}
              </span>
              <span className="text-[10px] text-slate-400 block">Approved & Selesai</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Charts Visualization Section */}
      {mounted && charts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Bar Chart (2 columns span) */}
          <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-xl shadow-sm space-y-6 bg-white">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                PERFORMA KEUANGAN
              </span>
              <h3 className="text-lg font-semibold text-slate-800 mt-1">Grafik Omzet Pemasukan 2026</h3>
            </div>
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlyRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(0,0,0,0.4)" />
                  <YAxis
                    stroke="rgba(0,0,0,0.4)"
                    tickFormatter={(val) => `Rp ${val / 1000000}jt`}
                  />
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    labelStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                    formatter={(val: any) => [formatIDR(Number(val || 0)), 'Omzet']}
                  />
                  <Bar dataKey="omzet" fill="#0033A0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Services Pie Chart */}
          <div className="glass-panel p-6 rounded-xl shadow-sm flex flex-col justify-between space-y-6 bg-white">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                PRODUKTIVITAS
              </span>
              <h3 className="text-lg font-semibold text-slate-800 mt-1">Layanan Terpopuler</h3>
            </div>
            <div className="h-56 w-full text-xs flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.popularServices}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {charts.popularServices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    formatter={(val: any) => [val, `Pengajuan`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center pb-2">
              {charts.popularServices.map((entry, idx) => (
                <div key={entry.name} className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="font-semibold">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown Bar chart */}
          <div className="lg:col-span-3 glass-panel p-6 md:p-8 rounded-xl shadow-sm space-y-6 bg-white">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                CORONG PROSES KONSULTASI
              </span>
              <h3 className="text-lg font-semibold text-slate-800 mt-1">Rincian Status Request</h3>
            </div>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.statusBreakdown} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis type="number" stroke="rgba(0,0,0,0.4)" />
                  <YAxis dataKey="name" type="category" stroke="rgba(0,0,0,0.4)" />
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    formatter={(val: any) => [val, 'Jumlah']}
                  />
                  <Bar dataKey="value" fill="#0033A0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
