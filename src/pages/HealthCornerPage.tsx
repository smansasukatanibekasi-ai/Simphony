import { motion } from 'motion/react';
import { Heart, Apple, Moon, Zap, Baby, Brain, ShieldCheck, ChevronRight } from 'lucide-react';

export default function HealthCornerPage() {
  const tips = [
    {
      title: "Pola Tidur Sehat",
      icon: Moon,
      color: "bg-blue-100 text-blue-600",
      content: "Tidur 7-9 jam sehari membantu otak mengonsolidasi memori dan menstabilkan emosi. Hindari gadget 30 menit sebelum tidur.",
    },
    {
      title: "Nutrisi untuk Otak",
      icon: Apple,
      color: "bg-emerald-100 text-emerald-600",
      content: "Konsumsi makanan kaya omega-3, sayuran hijau, dan buah-buahan untuk meningkatkan fokus dan suasana hati selama belajar.",
    },
    {
      title: "Hidrasi yang Cukup",
      icon: Zap,
      color: "bg-amber-100 text-amber-600",
      content: "Minum air putih minimal 2 liter per hari. Dehidrasi ringan dapat menurunkan konsentrasi dan meningkatkan rasa lelah.",
    },
    {
      title: "Manajemen Stres",
      icon: Brain,
      color: "bg-purple-100 text-purple-600",
      content: "Latihan pernapasan dalam (Deep Breathing) selama 5 menit dapat menurunkan kadar kortisol dan memberikan rasa tenang instan.",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-12"
    >
      <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-10 w-48 h-48 bg-rose-50 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-serif font-bold text-slate-800 tracking-tight">Pojok Sehat</h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Kesehatan fisik adalah pondasi dari kesehatan mental yang kuat. Temukan saran praktis dari ahli kami untuk menjaga kebugaranmu di sekolah.
            </p>
            <div className="flex gap-4">
              <div className="bg-white border border-slate-100 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
                <ShieldCheck className="text-emerald-500" />
                <span className="text-sm font-bold text-slate-700 font-serif italic">Verified Info</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <div className="bg-rose-50 p-8 rounded-[40px] text-rose-500">
              <Heart size={120} className="animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-brand-primary rounded-full"></div>
          <h2 className="text-2xl font-serif font-bold text-slate-800">Tips Kesehatan Siswa</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tips.map((tip, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className={`w-14 h-14 ${tip.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <tip.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{tip.title}</h3>
              <p className="text-slate-500 leading-relaxed">{tip.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
          <Baby size={48} className="text-emerald-400" />
          <h2 className="text-3xl font-serif font-bold italic">"Tubuhmu adalah rumahmu satu-satunya, rawatlah dengan baik."</h2>
          <p className="text-slate-400">Punya pertanyaan spesifik tentang kesehatanmu? Jangan ragu untuk mendiskusikannya dengan tim medis sekolah di UKS.</p>
          <button className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-400 transition-all flex items-center gap-2">
            Konsultasi UKS Digital
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </motion.div>
  );
}
