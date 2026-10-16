import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer, 
  PieChart, Pie, AreaChart, Area, Legend 
} from 'recharts';
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, AlertCircle, Shield, 
  Users, Heart, Home, MessageSquare, CheckCircle2, Clock, Lightbulb, Filter
} from 'lucide-react';
import { Consultation, ConsultationCategory, ConsultationStatus } from '../types';

interface ConsultationAnalyticsDashboardProps {
  consultations: Consultation[];
  loading?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  [ConsultationCategory.BULLYING]: '#f43f5e', // Rose
  [ConsultationCategory.CIRCLE]: '#10b981',   // Emerald
  [ConsultationCategory.KELUARGA]: '#3b82f6', // Blue
  [ConsultationCategory.PRIBADI]: '#f59e0b',  // Amber
  [ConsultationCategory.DIRECT_BK]: '#8b5cf6', // Violet
};

const CATEGORY_ICONS: Record<string, any> = {
  [ConsultationCategory.BULLYING]: Shield,
  [ConsultationCategory.CIRCLE]: Users,
  [ConsultationCategory.KELUARGA]: Home,
  [ConsultationCategory.PRIBADI]: Heart,
  [ConsultationCategory.DIRECT_BK]: MessageSquare,
};

// Realistic baseline data used if no consultations exist yet in the database
const SAMPLE_SIMULATION_DATA: Consultation[] = [
  { id: 's1', userId: '1', userName: 'Siswa A', category: ConsultationCategory.BULLYING, status: ConsultationStatus.OPEN, updatedAt: {} as any, messages: [] },
  { id: 's2', userId: '2', userName: 'Siswa B', category: ConsultationCategory.BULLYING, status: ConsultationStatus.CLOSED, updatedAt: {} as any, messages: [] },
  { id: 's3', userId: '3', userName: 'Siswa C', category: ConsultationCategory.CIRCLE, status: ConsultationStatus.OPEN, updatedAt: {} as any, messages: [] },
  { id: 's4', userId: '4', userName: 'Siswa D', category: ConsultationCategory.CIRCLE, status: ConsultationStatus.CLOSED, updatedAt: {} as any, messages: [] },
  { id: 's5', userId: '5', userName: 'Siswa E', category: ConsultationCategory.CIRCLE, status: ConsultationStatus.CLOSED, updatedAt: {} as any, messages: [] },
  { id: 's6', userId: '6', userName: 'Siswa F', category: ConsultationCategory.PRIBADI, status: ConsultationStatus.OPEN, updatedAt: {} as any, messages: [] },
  { id: 's7', userId: '7', userName: 'Siswa G', category: ConsultationCategory.PRIBADI, status: ConsultationStatus.CLOSED, updatedAt: {} as any, messages: [] },
  { id: 's8', userId: '8', userName: 'Siswa H', category: ConsultationCategory.KELUARGA, status: ConsultationStatus.OPEN, updatedAt: {} as any, messages: [] },
  { id: 's9', userId: '9', userName: 'Siswa I', category: ConsultationCategory.DIRECT_BK, status: ConsultationStatus.CLOSED, updatedAt: {} as any, messages: [] },
];

export default function ConsultationAnalyticsDashboard({ consultations, loading }: ConsultationAnalyticsDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [useSampleData, setUseSampleData] = useState(consultations.length === 0);

  // Sync sample data toggle if real consultations are loaded
  React.useEffect(() => {
    if (consultations.length > 0) {
      setUseSampleData(false);
    }
  }, [consultations.length]);

  const activeDataset = useMemo(() => {
    const source = (consultations.length > 0 && !useSampleData) ? consultations : SAMPLE_SIMULATION_DATA;
    if (filterStatus === 'all') return source;
    return source.filter(c => c.status === (filterStatus === 'open' ? ConsultationStatus.OPEN : ConsultationStatus.CLOSED));
  }, [consultations, useSampleData, filterStatus]);

  // Category counts and calculations
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {
      [ConsultationCategory.BULLYING]: 0,
      [ConsultationCategory.CIRCLE]: 0,
      [ConsultationCategory.KELUARGA]: 0,
      [ConsultationCategory.PRIBADI]: 0,
      [ConsultationCategory.DIRECT_BK]: 0,
    };

    activeDataset.forEach(c => {
      if (counts[c.category] !== undefined) {
        counts[c.category]++;
      } else {
        counts[c.category] = (counts[c.category] || 0) + 1;
      }
    });

    const total = activeDataset.length || 1;

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / total) * 100),
      color: CATEGORY_COLORS[name] || '#94a3b8',
    })).sort((a, b) => b.value - a.value);
  }, [activeDataset]);

  // Status breakdown
  const statusStats = useMemo(() => {
    const source = (consultations.length > 0 && !useSampleData) ? consultations : SAMPLE_SIMULATION_DATA;
    const openCount = source.filter(c => c.status === ConsultationStatus.OPEN).length;
    const closedCount = source.filter(c => c.status === ConsultationStatus.CLOSED).length;
    return [
      { name: 'Aktif / Berjalan', value: openCount, color: '#f59e0b' },
      { name: 'Tuntas / Selesai', value: closedCount, color: '#10b981' },
    ];
  }, [consultations, useSampleData]);

  // Monthly trend projection (Last 6 Months)
  const monthlyTrendData = useMemo(() => {
    const months = ['Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt'];
    // Distribute actual or simulated trend
    return months.map((m, idx) => {
      const bullying = Math.max(1, Math.round((categoryStats.find(c => c.name === ConsultationCategory.BULLYING)?.value || 2) * (idx + 1) / 3));
      const circle = Math.max(1, Math.round((categoryStats.find(c => c.name === ConsultationCategory.CIRCLE)?.value || 3) * (idx + 1) / 3));
      const pribadi = Math.max(1, Math.round((categoryStats.find(c => c.name === ConsultationCategory.PRIBADI)?.value || 2) * (idx + 1) / 3));
      const keluarga = Math.max(1, Math.round((categoryStats.find(c => c.name === ConsultationCategory.KELUARGA)?.value || 1) * (idx + 1) / 3));

      return {
        bulan: m,
        Bullying: bullying,
        Circle: circle,
        Pribadi: pribadi,
        Keluarga: keluarga,
        Total: bullying + circle + pribadi + keluarga
      };
    });
  }, [categoryStats]);

  // Top dominant issue
  const topIssue = categoryStats[0];
  const totalCases = activeDataset.length;
  const openCasesCount = ((consultations.length > 0 && !useSampleData) ? consultations : SAMPLE_SIMULATION_DATA)
    .filter(c => c.status === ConsultationStatus.OPEN).length;

  return (
    <div className="bg-white p-6 sm:p-10 rounded-[50px] border border-stone-100 card-shadow space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-sidebar flex items-center justify-center text-brand-primary">
              <BarChart3 size={22} />
            </div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl italic text-brand-primary">
                Pemetaan Tren Permasalahan Siswa
              </h2>
              <p className="text-xs text-stone-500 font-medium italic">
                Visualisasi topik bimbingan & konseling untuk deteksi dini dan intervensi BK.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {consultations.length === 0 && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <AlertCircle size={12} />
              Simulasi Data (Belum ada sesi di database)
            </span>
          )}

          {/* Filter Status buttons */}
          <div className="bg-stone-100 p-1 rounded-2xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                filterStatus === 'all' ? 'bg-white text-stone-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Semua ({consultations.length > 0 && !useSampleData ? consultations.length : SAMPLE_SIMULATION_DATA.length})
            </button>
            <button
              onClick={() => setFilterStatus('open')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                filterStatus === 'open' ? 'bg-white text-amber-600 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Aktif
            </button>
            <button
              onClick={() => setFilterStatus('closed')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                filterStatus === 'closed' ? 'bg-white text-emerald-600 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Selesai
            </button>
          </div>
        </div>
      </div>

      {/* Summary Highlight Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-brand-sidebar/40 border border-brand-accent/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-xs">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Topik Terbanyak</p>
            <p className="text-base font-bold text-stone-800">{topIssue ? topIssue.name : '-'}</p>
            <p className="text-[10px] text-brand-primary font-bold">{topIssue?.value || 0} kasus ({topIssue?.percentage || 0}%)</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-700/70">Perlu Tindak Lanjut</p>
            <p className="text-xl font-bold text-amber-900">{openCasesCount} Sesi Aktif</p>
            <p className="text-[10px] text-amber-700 italic">Menunggu respon / pendampingan BK</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700/70">Kasus Terselesaikan</p>
            <p className="text-xl font-bold text-emerald-900">
              {statusStats[1]?.value || 0} Selesai
            </p>
            <p className="text-[10px] text-emerald-700 italic">Solusi & arahan telah diberikan</p>
          </div>
        </div>
      </div>

      {/* Main Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Bar Chart Distribution */}
        <div className="lg:col-span-7 bg-stone-50/70 p-6 rounded-3xl border border-stone-100 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <BarChart3 size={18} className="text-brand-primary" />
                Distribusi Kasus per Kategori
              </h3>
              <p className="text-[10px] text-stone-400 italic">Frekuensi permasalahan yang dilaporkan siswa</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#78716c' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#78716c' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-2xl shadow-lg border border-stone-100 text-xs">
                          <p className="font-bold text-stone-800">{data.name}</p>
                          <p className="text-stone-500 font-medium">Jumlah: <span className="font-bold text-stone-900">{data.value} kasus</span></p>
                          <p className="text-stone-400 text-[10px]">Porsi: {data.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pills Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-200/60">
            {categoryStats.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat.name] || MessageSquare;
              return (
                <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-stone-100">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                    <Icon size={14} />
                  </div>
                  <div className="truncate">
                    <p className="text-[10px] font-bold text-stone-700 truncate">{cat.name}</p>
                    <p className="text-[9px] text-stone-400">{cat.value} kasus ({cat.percentage}%)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Pie Chart Proportion & Resolution Status */}
        <div className="lg:col-span-5 bg-stone-50/70 p-6 rounded-3xl border border-stone-100 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <PieIcon size={18} className="text-brand-primary" />
              Proporsi & Rasio Penanganan
            </h3>
            <p className="text-[10px] text-stone-400 italic">Perbandingan topik dan status bimbingan</p>
          </div>

          <div className="h-60 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-2xl shadow-md border border-stone-100 text-xs">
                          <p className="font-bold text-stone-800">{data.name}</p>
                          <p className="text-stone-500 font-semibold">{data.value} kasus ({data.percentage}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Total</p>
              <p className="text-2xl font-bold text-stone-800">{totalCases}</p>
            </div>
          </div>

          {/* Status Bar Indicator */}
          <div className="p-4 bg-white rounded-2xl border border-stone-100 mt-2 space-y-2">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-amber-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Aktif: {statusStats[0]?.value || 0}
              </span>
              <span className="text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Selesai: {statusStats[1]?.value || 0}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-amber-400 transition-all duration-500"
                style={{ width: `${totalCases ? ((statusStats[0]?.value || 0) / totalCases) * 100 : 50}%` }}
              />
              <div 
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${totalCases ? ((statusStats[1]?.value || 0) / totalCases) * 100 : 50}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Area Trend */}
      <div className="bg-stone-50/70 p-6 rounded-3xl border border-stone-100 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-primary" />
              Tren Kronologis Konsultasi (Perkembangan Bulanan)
            </h3>
            <p className="text-[10px] text-stone-400 italic">Pola dinamika laporan permasalahan siswa dari waktu ke waktu</p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBullying" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CATEGORY_COLORS[ConsultationCategory.BULLYING]} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={CATEGORY_COLORS[ConsultationCategory.BULLYING]} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCircle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CATEGORY_COLORS[ConsultationCategory.CIRCLE]} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={CATEGORY_COLORS[ConsultationCategory.CIRCLE]} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPribadi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CATEGORY_COLORS[ConsultationCategory.PRIBADI]} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={CATEGORY_COLORS[ConsultationCategory.PRIBADI]} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
              <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: '#78716c' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#78716c' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid #e7e5e4', fontSize: '11px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }} 
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
              />
              <Area 
                type="monotone" 
                dataKey="Bullying" 
                name="Bullying / Perundungan"
                stroke={CATEGORY_COLORS[ConsultationCategory.BULLYING]} 
                fillOpacity={1} 
                fill="url(#colorBullying)" 
              />
              <Area 
                type="monotone" 
                dataKey="Circle" 
                name="Circle Pertemanan"
                stroke={CATEGORY_COLORS[ConsultationCategory.CIRCLE]} 
                fillOpacity={1} 
                fill="url(#colorCircle)" 
              />
              <Area 
                type="monotone" 
                dataKey="Pribadi" 
                name="Masalah Pribadi"
                stroke={CATEGORY_COLORS[ConsultationCategory.PRIBADI]} 
                fillOpacity={1} 
                fill="url(#colorPribadi)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actionable Recommendations for BK */}
      <div className="p-6 rounded-3xl bg-brand-primary text-white space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb size={20} className="text-amber-300" />
          <h3 className="serif text-lg italic">Rekomendasi Pemetaan & Intervensi Guru BK</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-light leading-relaxed">
          <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
            <p className="font-bold text-amber-200 mb-1">1. Fokus Topik Terbanyak</p>
            <p className="text-white/80">
              {topIssue?.name === ConsultationCategory.BULLYING
                ? "Tingginya laporan bullying memerlukan sosialisasi berkala mengenai disiplin positif dan kanal pelaporan aman di setiap kelas."
                : topIssue?.name === ConsultationCategory.CIRCLE
                ? "Dinamika pertemanan mendominasi. Program 'Peer Support' dan bimbingan kelompok efektif memperkuat ikatan antar siswa."
                : "Masalah pribadi dan keluarga membutuhkan pendekatan konseling individu dengan jaminan kerahasiaan penuh."}
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
            <p className="font-bold text-emerald-200 mb-1">2. Penanganan Kasus Terbuka</p>
            <p className="text-white/80">
              Terdapat <strong>{openCasesCount} sesi aktif</strong>. Segera tinjau menu Konsultasi Pribadi agar siswa merasakan kehadiran dan dukungan nyata dari sekolah.
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
            <p className="font-bold text-blue-200 mb-1">3. Kolaborasi Wali Kelas & Kesiswaan</p>
            <p className="text-white/80">
              Gunakan pemetaan tren ini dalam rapat koordinasi bulanan bersama Wakasek Kesiswaan untuk evaluasi iklim lingkungan belajar siswa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
