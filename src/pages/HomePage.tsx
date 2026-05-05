import { motion } from 'motion/react';
import { Sparkles, Users, MessageSquare, Bot, Heart, Leaf, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../types';
import { COUNSELORS } from '../constants';
import Logo from '../components/Logo';

export default function HomePage({ profile, logoUrl }: { profile: UserProfile | null, logoUrl: string | null }) {
  const features = [
    { name: 'Komunitas', path: '/komunitas', icon: Users, color: 'bg-[#CCD5AE] text-[#5A5A40]', label: '☮', desc: 'Wadah berbagi pengalaman.' },
    { name: 'Konsultasi', path: '/konsultasi', icon: MessageSquare, color: 'bg-[#E9EDC9] text-[#5A5A40]', label: '✎', desc: 'Bicara dengan para ahli.' },
    { name: 'Curhat Bot', path: '/bot', icon: Bot, color: 'bg-[#FAEDCD] text-[#D4A373]', label: '◈', desc: 'Teman cerita virtual.' },
    { name: 'Gamifikasi', path: '/game', icon: Leaf, color: 'bg-[#D4A373]/20 text-[#D4A373]', label: '❀', desc: 'Rawat pohon harmonimu.' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Hero Card - Mood & Growth */}
        <section className="md:col-span-8 glass rounded-[40px] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-[400px] card-shadow">
          <div className="absolute -right-10 -top-10 w-64 h-64 tree-gradient rounded-full opacity-10 blur-3xl"></div>
          
          <div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary">Mood & Pertumbuhan</h3>
              <Logo logoUrl={logoUrl} size="md" className="hidden lg:flex" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-40 h-40 flex flex-col items-center justify-center relative">
                <div className="w-24 h-32 bg-brand-secondary rounded-full opacity-20 absolute bottom-0 blur-2xl"></div>
                <div className="text-7xl mb-4">🌱</div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-secondary h-full transition-all duration-1000" style={{ width: `${Math.min((profile?.treeLevel || 1) * 5, 100)}%` }}></div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="serif text-3xl md:text-4xl font-semibold mb-3 italic text-brand-primary">Pohon SIMPHONY-mu Sedang Tumbuh</p>
                <p className="text-sm text-stone-700 font-medium leading-relaxed max-w-md">
                  Kamu berada di level {profile?.treeLevel || 1}. Teruslah berbagi afirmasi positif dan siram pohonmu setiap hari.
                </p>
                <Link to="/game" className="mt-8 inline-block px-8 py-3 bg-brand-primary text-white rounded-full text-sm font-medium hover:opacity-90 shadow-lg shadow-brand-primary/20 transition-all">
                  Siram Pohon (Mood Check)
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Peer Support Sidebar in Grid */}
        <section className="md:col-span-4 bg-[#FEFAE0] rounded-[40px] p-8 border border-[#E9EDC9] card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-6">Peer Support</h3>
            <div className="space-y-4">
              {['Zahra Mauli', 'Abdul Azis'].map((name, i) => (
                <div key={name} className="p-4 bg-white/60 rounded-2xl border border-[#E9EDC9] flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full border-2 border-white ${i === 0 ? 'bg-[#D4A373]' : 'bg-[#A3B18A]'}`}></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{name}</p>
                    <p className="text-[9px] text-[#5A5A40] uppercase tracking-wider font-extrabold">Tersedia</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link to="/relaksasi" className="mt-8 text-center text-xs font-bold text-[#5A5A40] uppercase tracking-widest hover:underline">
            Lihat Semua Teman →
          </Link>
        </section>
      </div>

      {/* Secondary Features Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Counselors Card */}
        <div className="bg-white rounded-[40px] p-8 card-shadow border border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-6">Pojok Konselor</h3>
          <div className="space-y-4">
            {COUNSELORS.slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-brand-sidebar flex items-center justify-center text-[10px] font-bold text-brand-primary border border-stone-200">
                  {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{c.name}</p>
                  <p className="text-[10px] text-stone-600 font-bold italic">{c.position}</p>
                </div>
              </div>
            ))}
            <Link to="/konsultasi" className="block w-full py-3 text-center border border-stone-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors mt-4">
              Lihat Semua Konselor
            </Link>
          </div>
        </div>

        {/* Curhat Bot Card */}
        <div className="bg-brand-primary rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-brand-primary/20">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Bot size={80} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-6">Curhat Bot</h3>
          <div className="bg-white/10 rounded-3xl p-6 mb-6">
            <p className="text-xs leading-relaxed italic text-white font-medium">
              "Halo, terima kasih sudah berani cerita. Aku paham banget kalau diperlakukan tidak menyenangkan itu rasanya berat. Kamu tidak sendirian..."
            </p>
          </div>
          <Link to="/bot" className="flex items-center justify-between bg-white text-brand-primary rounded-full px-6 py-3 text-xs font-bold hover:bg-stone-100 transition-colors">
            <span>Mulai Bercerita Sekarang</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Info Riset Strip */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <div>
          <p className="text-[10px] font-extrabold text-stone-600 uppercase tracking-[0.2em] mb-1">Info Riset & Inovasi</p>
          <p className="text-xs font-bold text-brand-primary italic">IRCYS 2024 Finalist: SMA Negeri 1 Sukatani</p>
        </div>
        <Link to="/riset" className="text-[10px] font-bold text-stone-700 uppercase tracking-widest border-b border-stone-300 pb-1">
          Pelajari Selengkapnya
        </Link>
      </div>
    </motion.div>
  );
}
