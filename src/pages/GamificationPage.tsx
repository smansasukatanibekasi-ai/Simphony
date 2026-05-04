import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Droplets, TrendingUp, Calendar, Heart, Brain, Info, Plus } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, MoodEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GamificationPage({ profile }: { profile: UserProfile | null }) {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [selectedMoodValue, setSelectedMoodValue] = useState<number | null>(null);

  const moodsList = [
    { value: 1, label: '😢', name: 'Sedih', color: '#E07A5F', analysis: 'Sedih itu wajar. Jangan memikulnya sendiri; cobalah berbagi cerita dengan Guru BK atau Curhat Bot SIMPHONY.' },
    { value: 2, label: '😕', name: 'Kurang Baik', color: '#F2CC8F', analysis: 'Sepertinya harimu agak berat. Coba teknik relaksasi sejenak dan dengarkan musik yang menenangkan.' },
    { value: 3, label: '😐', name: 'Biasa Saja', color: '#81B29A', analysis: 'Hari yang cukup stabil. Cari satu hal kecil yang bisa kamu syukuri hari ini untuk menambah semangat.' },
    { value: 4, label: '😊', name: 'Senang', color: '#3D405B', analysis: 'Senang mendengarnya! Bagikan energi positifmu dengan menyapa teman atau membagikan pesan afirmasi.' },
    { value: 5, label: '🤩', name: 'Sangat Bahagia', color: '#F4F1DE', analysis: 'Luar biasa! Kamu sedang dalam kondisi mental prima. Teruslah tebarkan kebaikan dan kebahagiaan!' },
  ];

  useEffect(() => {
    if (!profile) return;
    const path = 'moods';
    const q = query(
      collection(db, path),
      where('userId', '==', profile.uid),
      orderBy('createdAt', 'asc'),
      limit(7)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Format for Recharts
        date: doc.data().createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      })) as any[];
      setMoods(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, [profile]);

  const handleWatering = async () => {
    if (!profile || isWatering) return;
    
    setIsWatering(true);
    const path = `users/${profile.uid}`;
    try {
      const userRef = doc(db, 'users', profile.uid);
      const currentLevel = profile.treeLevel || 0;
      let newLevel = currentLevel + 1;
      let updateData: any = {
        lastWatered: serverTimestamp()
      };

      if (newLevel > 100) {
        newLevel = 1;
        updateData.treeCount = increment(1);
      }
      
      updateData.treeLevel = newLevel;

      await updateDoc(userRef, updateData);
      setTimeout(() => setIsWatering(false), 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      setIsWatering(false);
    }
  };

  const getTreeVisual = () => {
    const level = profile?.treeLevel || 0;
    
    if (level <= 15) {
      // Stage: Seedling
      return (
        <motion.div key="seedling" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
          <div className="w-2 h-4 bg-[#8C7851] rounded-full"></div>
          <div className="flex gap-1 -mt-2">
            <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-4 h-2 bg-[#A3B18A] rounded-full"></motion.div>
            <motion.div animate={{ rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="w-4 h-2 bg-[#A3B18A] rounded-full"></motion.div>
          </div>
        </motion.div>
      );
    } else if (level <= 40) {
      // Stage: Sapling
      return (
        <motion.div key="sapling" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative flex flex-col items-center">
          <div className="w-4 h-16 bg-[#8C7851] rounded-t-full"></div>
          <motion.div 
            animate={{ rotate: 15, scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute top-2 -left-6 w-10 h-6 bg-[#588157] rounded-full"
          ></motion.div>
          <motion.div 
            animate={{ rotate: -15, scale: [1, 1.05, 1] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute top-6 -right-6 w-8 h-5 bg-[#A3B18A] rounded-full"
          ></motion.div>
        </motion.div>
      );
    } else if (level <= 75) {
      // Stage: Growing Tree
      return (
        <motion.div key="growing" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative flex flex-col items-center">
          <div className="w-6 h-32 bg-[#8C7851] rounded-t-full relative">
            <div className="absolute top-4 -left-12 w-16 h-10 bg-[#3A5A40] rounded-full opacity-90"></div>
            <div className="absolute top-12 -right-14 w-20 h-12 bg-[#588157] rounded-full opacity-90"></div>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-20 bg-[#A3B18A] rounded-full opacity-90"></div>
          </div>
        </motion.div>
      );
    } else {
      // Stage: Lush SIMPHONY Tree
      return (
        <motion.div key="full" initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative flex flex-col items-center">
          {/* Sparkles for full tree */}
          {level >= 95 && (
            <div className="absolute inset-x-0 -top-20 z-20 flex justify-center gap-4">
              <motion.div animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-yellow-400">✨</motion.div>
              <motion.div animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="text-yellow-200">✨</motion.div>
            </div>
          )}
          <div className="w-10 h-40 bg-[#5D4037] rounded-t-full relative">
            <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute -top-20 -left-20 w-52 h-48 bg-[#344E41] rounded-full opacity-95 blur-[1px]"></motion.div>
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 6, delay: 1 }} className="absolute -top-12 -right-16 w-36 h-36 bg-[#588157] rounded-full opacity-90 blur-[1px]"></motion.div>
            <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }} className="absolute -top-28 left-6 w-32 h-32 bg-[#A3B18A] rounded-full opacity-80 blur-[1px]"></motion.div>
            <div className="absolute inset-0 flex items-center justify-center text-white/10">
              <Leaf size={60} fill="currentColor" />
            </div>
          </div>
        </motion.div>
      );
    }
  };

  const submitMood = async (moodValue: number) => {
    if (!profile) return;
    const path = 'moods';
    try {
      await addDoc(collection(db, path), {
        userId: profile.uid,
        moodScore: moodValue,
        createdAt: serverTimestamp(),
      });
      setSelectedMoodValue(moodValue);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tree Section */}
        <section className="flex-1 glass p-8 lg:p-12 rounded-[50px] border-white/50 shadow-xl flex flex-col items-center relative overflow-hidden card-shadow">
          <div className="absolute top-0 w-full h-1/2 tree-gradient opacity-10 blur-3xl"></div>
          
          <div className="relative z-10 text-center space-y-2 mb-12">
            <h2 className="serif text-4xl italic text-brand-primary">Taman Harmoni</h2>
            <p className="text-stone-500 italic">Siram pohonmu untuk keseimbangan jiwa.</p>
          </div>

          <div className="relative h-80 w-full flex items-center justify-center">
            <motion.div 
              animate={{ 
                y: isWatering ? [0, -10, 0] : 0 
              }}
              className="relative"
            >
              <div className="w-8 h-4 bg-stone-800/10 mx-auto rounded-full blur-[4px]"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                {getTreeVisual()}
              </div>
            </motion.div>

            <AnimatePresence>
              {isWatering && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0, y: -100 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2"
                >
                  <div className="flex flex-col items-center gap-2">
                    <motion.div 
                      animate={{ y: [0, 50], opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: 2 }}
                    >
                      <Droplets size={48} className="text-blue-400" />
                    </motion.div>
                    <span className="font-black text-[12px] uppercase tracking-widest text-brand-primary bg-white/80 px-4 py-1 rounded-full shadow-sm">+1 Siraman</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-10 text-center w-full relative z-10">
            <div className="flex items-center justify-center gap-10 mb-8">
              <div className="text-center">
                <p className="serif text-4xl italic text-[#5A5A40]">{profile?.treeLevel || 0}</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">Level</p>
              </div>
              <div className="h-10 w-px bg-stone-200"></div>
              <div className="text-center">
                <p className="serif text-4xl italic text-[#B5838D]">{profile?.treeCount || 0}</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">Hutan</p>
              </div>
            </div>

            <div className="w-full bg-stone-100 h-2 rounded-full mb-6 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${profile?.treeLevel || 0}%` }}
                className="h-full bg-brand-primary"
              />
            </div>

            <button 
              id="btn-water-tree"
              onClick={handleWatering}
              disabled={isWatering}
              className="bg-brand-primary text-white w-full py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 card-shadow"
            >
              Siram Pohon 💧
            </button>
          </div>
        </section>

        {/* Mood Section */}
        <section className="lg:w-96 space-y-8">
          <div className="bg-[#FEFAE0] p-8 rounded-[40px] shadow-sm border border-[#E9EDC9] flex flex-col gap-6">
            <div className="space-y-1">
              <h3 className="serif text-2xl italic text-[#5A5A40]">Apa kabarmu?</h3>
              <p className="text-[10px] text-stone-600 font-black uppercase tracking-widest italic">Check-in Kesehatan Mental</p>
            </div>
            
            {!selectedMoodValue ? (
              <div className="grid grid-cols-5 gap-2">
                {moodsList.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => submitMood(m.value)}
                    title={m.name}
                    className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-white/50 transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">{m.label}</span>
                    <span className="text-[7px] font-black uppercase tracking-tighter text-stone-500">{m.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 p-5 rounded-3xl border border-stone-200/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{moodsList.find(m => m.value === selectedMoodValue)?.label}</span>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-brand-primary">Analisa SIMPHONY</p>
                    <p className="text-xs font-bold text-stone-800">{moodsList.find(m => m.value === selectedMoodValue)?.name}</p>
                  </div>
                </div>
                <p className="text-[10px] leading-relaxed text-stone-700 font-medium italic">
                  "{moodsList.find(m => m.value === selectedMoodValue)?.analysis}"
                </p>
                <button 
                  onClick={() => setSelectedMoodValue(null)}
                  className="mt-4 text-[7px] font-black uppercase tracking-widest text-stone-400 hover:text-brand-primary border-b border-stone-200 block"
                >
                  Ganti Mood
                </button>
              </motion.div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-stone-100 card-shadow">
            <h3 className="serif text-lg italic text-[#5A5A40] mb-8 text-center uppercase tracking-widest">Aliran Ketenangan</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moods}>
                  <XAxis dataKey="date" hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="moodScore" 
                    stroke="#A3B18A" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#A3B18A', strokeWidth: 0 }}
                    activeDot={{ r: 8, fill: '#588157' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>

      {/* Removed old modal */}
    </motion.div>
  );
}
