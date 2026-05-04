import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, MessageSquare, Heart, Trash2, Award, Zap } from 'lucide-react';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, Post, Consultation, PeerMessage } from '../types';
import { Link } from 'react-router-dom';

export default function AdminPage({ profile }: { profile: UserProfile | null }) {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    consultations: 0,
    messages: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const postsSnap = await getDocs(collection(db, 'posts'));
        const consultSnap = await getDocs(collection(db, 'consultations'));
        const peerSnap = await getDocs(collection(db, 'peer_messages'));

        setStats({
          users: usersSnap.size,
          posts: postsSnap.size,
          consultations: consultSnap.size,
          messages: peerSnap.size
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (!profile?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <ShieldCheck size={64} className="text-rose-500 mb-6 opacity-20" />
        <h1 className="serif text-3xl italic text-stone-800">Akses Terbatas</h1>
        <p className="text-stone-500 mt-4 max-w-sm">Hanya administrator yang dapat melihat halaman ini.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Siswa', value: stats.users, icon: Users, color: 'bg-blue-50 text-blue-600', link: '#' },
    { label: 'Cerita Komunitas', value: stats.posts, icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600', link: '/komunitas' },
    { label: 'Sesi Bimbingan', value: stats.consultations, icon: Heart, color: 'bg-rose-50 text-rose-600', link: '/konsultasi' },
    { label: 'Resonansi Positif', value: stats.messages, icon: Zap, color: 'bg-brand-sidebar text-brand-primary', link: '/relaksasi' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-12"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-brand-primary" size={24} />
            <h1 className="serif text-4xl italic text-brand-primary">Panel Admin SIMPHONY</h1>
          </div>
          <p className="text-stone-500 font-medium italic">Kelola bimbingan siswa dan keseimbangan ekosistem sekolah.</p>
        </div>
        
        <div className="px-6 py-3 bg-white rounded-3xl border border-stone-100 card-shadow flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-800">{profile.displayName}</p>
            <p className="text-[9px] text-stone-400 uppercase tracking-widest font-black">Authorized Official</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Link 
            key={idx}
            to={stat.link}
            className="bg-white p-8 rounded-[40px] border border-stone-100 card-shadow hover:scale-[1.02] transition-all group"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-bold text-stone-800 mb-1">{stat.value}</p>
            <p className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[50px] border border-stone-100 card-shadow space-y-8">
          <h2 className="serif text-2xl italic text-brand-primary flex items-center gap-3">
            <Award size={24} /> Panduan Moderasi
          </h2>
          <div className="space-y-6">
            {[
              { t: 'Prioritas Tertinggi', d: 'Segera respon Menu Konselor yang memiliki pesan mendesak.' },
              { t: 'Zero Tolerance', d: 'Hapus konten komunitas yang mengandung kata kasar atau perundungan.' },
              { t: 'Validasi Resonansi', d: 'Pastikan pesan relaksasi yang dikirim siswa tetap positif.' },
            ].map((rule, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 font-bold shrink-0">{i+1}</div>
                <div>
                  <p className="text-sm font-bold text-stone-800">{rule.t}</p>
                  <p className="text-xs text-stone-500 leading-relaxed font-medium italic">{rule.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-primary p-10 rounded-[50px] text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform">
            <ShieldCheck size={160} />
          </div>
          <div>
            <h3 className="serif text-3xl italic mb-4">Sinergi & Keselarasan</h3>
            <p className="text-sm text-white/80 leading-relaxed font-light italic">
              "Peran Anda sebagai Guru BK dan Administrator sangat krusial dalam menciptakan jaring pengaman sosial yang sehat bagi seluruh siswa."
            </p>
          </div>
          <Link 
            to="/konsultasi" 
            className="mt-10 inline-block px-10 py-4 bg-white text-brand-primary rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-stone-50 transition-colors w-fit shadow-xl shadow-brand-primary/20"
          >
            Masuk Panel BK
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
