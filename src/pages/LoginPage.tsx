import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Shield, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -m-20 w-96 h-96 tree-gradient rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -m-20 w-80 h-80 bg-brand-primary rounded-full opacity-5 blur-3xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass rounded-[60px] p-10 md:p-14 shadow-2xl relative z-10 border-white/50 text-center"
      >
        <div className="mb-10">
          <div className="w-20 h-20 bg-brand-cream rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand-accent/20">
            <Sparkles size={40} className="text-brand-primary" />
          </div>
          <h1 className="serif text-5xl font-bold text-brand-primary tracking-tight">SIMPHONY</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold mt-2">Student Harmony & Networking</p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-4 text-left p-4 bg-white/40 rounded-3xl border border-stone-100">
            <div className="w-10 h-10 rounded-full bg-brand-sidebar flex items-center justify-center text-brand-secondary">
              <Heart size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800 leading-none">Ruang Aman</p>
              <p className="text-[10px] text-stone-500 italic mt-1">Bercerita tanpa rasa takut dihakimi.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left p-4 bg-white/40 rounded-3xl border border-stone-100">
            <div className="w-10 h-10 rounded-full bg-brand-sidebar flex items-center justify-center text-brand-primary">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800 leading-none">Konsultasi Ahli</p>
              <p className="text-[10px] text-stone-500 italic mt-1">Terhubung langsung dengan bapak/ibu guru BK.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={signInWithGoogle}
          className="w-full bg-brand-primary text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <LogIn size={20} />
          Masuk dengan Akun Sekolah
        </button>

        <p className="mt-8 text-[10px] text-stone-400 font-medium italic">
          Khusus Siswa & Guru SMA Negeri 1 Sukatani
        </p>

        <div className="mt-12 pt-8 border-t border-stone-100">
          <div className="flex items-center justify-center gap-2 text-[#5A5A40]/60">
            <Shield size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Finalist IRCYS 2024</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
