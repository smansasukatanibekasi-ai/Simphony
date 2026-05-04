import { motion } from 'motion/react';
import { BookOpen, User, Calendar, Award, ExternalLink, ShieldCheck, Microscope } from 'lucide-react';

export default function ResearchPage() {
  const researchers = ["Anindya Kharisma Putri", "Anggun Zulfa Qurrotul Aini", "Denisa"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <header className="text-center space-y-4 pt-10">
        <div className="inline-block px-4 py-1 rounded-full bg-brand-cream border border-brand-accent/30 text-[10px] font-bold uppercase tracking-widest text-[#5A5A40]">
          Research & Innovation
        </div>
        <h1 className="serif text-5xl md:text-6xl italic text-brand-primary leading-tight">Menciptakan Keselarasan</h1>
        <p className="text-stone-700 font-medium italic max-w-xl mx-auto">Sebuah inisiatif dari SMA Negeri 1 Sukatani untuk mendukung kesehatan mental siswa melalui teknologi dan komunitas.</p>
      </header>

      <div className="bg-white p-10 md:p-14 rounded-[50px] border border-stone-100 shadow-sm space-y-10 card-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-accent mb-4">
            <BookOpen size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Judul Penelitian</span>
          </div>
          <h2 className="serif text-3xl md:text-4xl italic text-brand-primary leading-snug">
            "The Patterns of Interaction that Occur in the Learning Environment Case Study of SMA Negeri 1 Sukatani"
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-stone-100">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-black text-stone-600 text-[10px] uppercase tracking-[0.2em]">
              <Award size={16} /> 
              Pencapaian
            </h3>
            <p className="text-[#5A5A40] serif text-xl italic leading-relaxed">
              Dilombakan di International Research Conference for Youth Students (IRCYS) tahun 2024.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-black text-stone-600 text-[10px] uppercase tracking-[0.2em]">
              <Calendar size={16} /> 
              Tahun
            </h3>
            <p className="serif text-4xl italic text-[#588157]">2024</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[40px] shadow-sm space-y-8 card-shadow">
          <h3 className="serif text-2xl italic text-[#5A5A40]">Tim Peneliti</h3>
          <div className="space-y-4">
            {researchers.map((name, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-brand-sidebar text-brand-accent rounded-full flex items-center justify-center text-xs font-serif font-bold border border-stone-100">
                  {name[0]}
                </div>
                <span className="font-bold text-stone-700 text-sm italic">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-primary text-white p-10 rounded-[40px] shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div className="space-y-6">
            <h3 className="serif text-2xl italic">Tim Pendukung</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border border-white/20 text-2xl">
                  🍃
                </div>
                <div>
                  <p className="text-lg font-bold">Putri Komalasari, S.Pd.</p>
                  <p className="text-white/90 text-[10px] uppercase tracking-widest font-black">Pembimbing Riset</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border border-white/20 text-2xl">
                  👨‍🏫
                </div>
                <div>
                  <p className="text-lg font-bold">Irvan Daviana, S.Pd.</p>
                  <p className="text-white/90 text-[10px] uppercase tracking-widest font-black">Developer & Tech Lead</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-white/80 text-[10px] font-bold uppercase tracking-[0.2em]">
            <ShieldCheck size={16} />
            <span>Built with local wisdom</span>
          </div>
        </div>
      </div>

      <footer className="text-center pt-20">
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em]">&copy; 2024 SIMPHONY Project &bull; SMA Negeri 1 Sukatani</p>
      </footer>
    </motion.div>
  );
}
