import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MessageSquare, Send, Calendar, Shield, Users, CheckCircle2, ChevronRight, MessageCircle, X, Search, Filter, Plus, Trash2 } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, orderBy, arrayRemove, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Consultation, ConsultationCategory, ConsultationStatus, Message, UserProfile } from '../types';
import { COUNSELORS } from '../constants';

export default function ConsultationPage({ user, profile }: { user: any, profile: UserProfile | null }) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAdmin = profile?.isAdmin || false;

  useEffect(() => {
    if (!user) return;
    const path = 'consultations';
    
    // Admins see all, students see their own
    const q = isAdmin 
      ? query(collection(db, path), orderBy('updatedAt', 'desc'))
      : query(collection(db, path), where('userId', '==', user.uid), orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Consultation[];
      setConsultations(data);
      
      // If we have an active consultation, sync it from the new data
      if (activeConsultation) {
        const updated = data.find(c => c.id === activeConsultation.id);
        if (updated) setActiveConsultation(updated);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, [user, isAdmin]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConsultation?.messages]);

  const startNewConsultation = async (category: ConsultationCategory) => {
    if (!user) return;
    const path = 'consultations';
    try {
      const newConsultationData = {
        userId: user.uid,
        userName: user.displayName || 'Siswa',
        category,
        status: ConsultationStatus.OPEN,
        messages: [],
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, path), newConsultationData);
      
      // Set as active immediately with temporary data until onSnapshot syncs it
      setActiveConsultation({
        id: docRef.id,
        ...newConsultationData,
        updatedAt: Timestamp.now(), // approximation for UI
        createdAt: Timestamp.now(),
      } as any);
      
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const handleSendMessage = async () => {
    if (!activeConsultation || !newMessage.trim() || !user) return;
    const path = `consultations/${activeConsultation.id}`;

    try {
      const msg = {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || 'Siswa',
        createdAt: Timestamp.fromDate(new Date()),
      };

      const consultationRef = doc(db, 'consultations', activeConsultation.id!);
      await updateDoc(consultationRef, {
        messages: arrayUnion(msg),
        updatedAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };
  
  const handleDeleteMessage = async (msg: Message) => {
    if (!activeConsultation || !user || !activeConsultation.id) return;

    // Confirm deletion
    if (!window.confirm('Hapus pesan ini?')) return;

    try {
      const consultationRef = doc(db, 'consultations', activeConsultation.id);
      await updateDoc(consultationRef, {
        messages: arrayRemove(msg),
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Gagal menghapus pesan. Silakan coba lagi.');
    }
  };

  const closeConsultation = async (id: string) => {
    const path = `consultations/${id}`;
    try {
      await updateDoc(doc(db, 'consultations', id), {
        status: ConsultationStatus.CLOSED,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const categories: ConsultationCategory[] = [
    ConsultationCategory.BULLYING,
    ConsultationCategory.KELUARGA,
    ConsultationCategory.CIRCLE,
    ConsultationCategory.PRIBADI,
    ConsultationCategory.DIRECT_BK
  ];

  const filteredConsultations = consultations.filter(c => 
    activeTab === 'active' ? c.status === ConsultationStatus.OPEN : c.status === ConsultationStatus.CLOSED
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[calc(100vh-220px)] lg:min-h-[600px]">
        {/* Sidebar: List of Consultations */}
        <div className={`lg:col-span-4 flex flex-col gap-6 ${activeConsultation ? 'hidden lg:flex' : 'flex'}`}>
          <div className="bg-brand-sidebar p-6 sm:p-8 rounded-[40px] border border-stone-200 card-shadow flex flex-col gap-6">
            <div>
              <h1 className="serif text-3xl italic text-brand-primary">
                {isAdmin ? 'Panel Admin BK' : 'Konsultasi Pribadi'}
              </h1>
              <p className="text-stone-700 italic text-[10px] mt-1 font-medium">
                {isAdmin ? 'Kelola seluruh konsultasi dan bimbingan siswa.' : 'Sampaikan keresahanmu secara privat kepada Guru BK.'}
              </p>
            </div>

            <div className="bg-white/50 p-6 rounded-[32px] border border-stone-100">
              <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-400 mb-4 text-center">Tim Konselor SIMPHONY</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {COUNSELORS.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-stone-800 leading-tight">{c.name}</p>
                      <p className="text-[8px] text-stone-400 font-medium italic">{c.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[400px] lg:min-h-0 bg-white rounded-[40px] border border-stone-100 card-shadow overflow-hidden flex flex-col">
            <div className="flex border-b border-stone-50">
              <button 
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-4 text-[10px] uppercase tracking-widest font-black transition-colors ${activeTab === 'active' ? 'text-brand-primary bg-brand-sidebar' : 'text-stone-600'}`}
              >
                Aktif ({consultations.filter(c => c.status === ConsultationStatus.OPEN).length})
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 text-[10px] uppercase tracking-widest font-black transition-colors ${activeTab === 'history' ? 'text-brand-primary bg-brand-sidebar' : 'text-stone-600'}`}
              >
                Selesai ({consultations.filter(c => c.status === ConsultationStatus.CLOSED).length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] lg:max-h-full">
              {filteredConsultations.length === 0 ? (
                <div className="text-center py-20 opacity-30 italic text-xs">
                  Tidak ada data.
                </div>
              ) : (
                filteredConsultations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConsultation(c)}
                    className={`w-full p-5 rounded-[32px] text-left transition-all border ${
                      activeConsultation?.id === c.id 
                        ? 'bg-brand-cream border-brand-accent/20 shadow-sm' 
                        : 'bg-white border-transparent hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{c.category}</span>
                       <span className="text-[8px] text-stone-600 font-bold">{c.updatedAt?.toDate().toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-bold text-stone-950 italic line-clamp-1">
                      {isAdmin ? `Siswa: ${c.userName}` : 'Bimbingan Baru'}
                    </p>
                    <p className="text-[10px] text-stone-700 font-medium line-clamp-1 mt-1 italic">
                      {c.messages.length > 0 ? c.messages[c.messages.length - 1].text : 'Belum ada pesan...'}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Content: Chat Window */}
        <div className={`lg:col-span-8 bg-white rounded-[40px] sm:rounded-[60px] border border-stone-100 card-shadow flex flex-col overflow-hidden relative min-h-[500px] lg:min-h-0 ${activeConsultation ? 'flex' : 'hidden lg:flex'}`}>
          <AnimatePresence mode="wait">
            {!activeConsultation ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-12 overflow-y-auto"
              >
                {!isAdmin ? (
                  <div className="max-w-xl mx-auto w-full py-6 sm:py-0">
                    <div className="text-center mb-8 sm:mb-10">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-sidebar rounded-full flex items-center justify-center text-brand-primary mx-auto mb-4 sm:mb-6">
                        <MessageCircle size={32} className="sm:size-10 opacity-40" />
                      </div>
                      <h3 className="serif text-2xl sm:text-3xl italic text-stone-800 mb-2">Mulai Konsultasi Baru</h3>
                      <p className="text-[10px] sm:text-xs text-stone-500 italic font-medium px-4">Bapak/Ibu Guru BK siap mendengarkan dan menjaga rahasiamu.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-2 sm:px-0">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => startNewConsultation(cat)}
                          className="p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-stone-100 hover:border-brand-accent/30 hover:bg-brand-sidebar/30 transition-all text-left group bg-white shadow-sm"
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-sidebar rounded-2xl flex items-center justify-center text-brand-secondary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                            <Shield size={20} className="sm:size-[22px]" />
                          </div>
                          <span className="font-black text-stone-800 text-xs sm:text-sm uppercase tracking-widest block mb-1">{cat}</span>
                          <span className="text-[9px] sm:text-[10px] text-stone-400 italic">Klik untuk mulai chat privat</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-sidebar rounded-full flex items-center justify-center text-brand-primary mb-6">
                      <Shield size={36} className="sm:size-12 opacity-30" />
                    </div>
                    <h3 className="serif text-2xl sm:text-3xl italic text-stone-800">Panel Admin BK</h3>
                    <p className="text-[10px] sm:text-xs text-stone-500 mt-4 max-w-sm italic">Pilih pesan siswa dari daftar di samping untuk memberikan bimbingan dan solusi.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col h-[600px] lg:h-full overflow-hidden"
              >
                {/* Chat Header */}
                <div className="px-6 sm:px-8 py-4 sm:py-6 border-b border-stone-50 flex justify-between items-center bg-brand-sidebar/30">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button 
                      onClick={() => setActiveConsultation(null)}
                      className="lg:hidden p-2 -ml-2 text-stone-600"
                    >
                      <ChevronRight size={24} className="rotate-180" />
                    </button>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                      {activeConsultation.userName[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                        {activeConsultation.userName}
                        {isAdmin && (
                          <span className="bg-emerald-100 text-emerald-700 text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                            Authorized
                          </span>
                        )}
                      </h3>
                      <p className="text-[9px] text-brand-primary uppercase tracking-widest font-bold">
                        {activeConsultation.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeConsultation.status === ConsultationStatus.OPEN && (
                      <button 
                        onClick={() => closeConsultation(activeConsultation.id!)}
                        className="text-[9px] font-black text-stone-600 hover:text-rose-600 uppercase tracking-widest transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 size={14} />
                        Selesaikan Sesi
                      </button>
                    )}
                    <button 
                      onClick={() => setActiveConsultation(null)}
                      className="p-2 hover:bg-stone-100 rounded-full text-stone-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages List */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 bg-brand-sidebar/10">
                  {activeConsultation.messages.length === 0 ? (
                    <div className="text-center py-20 opacity-30 italic text-xs">
                      Belum ada pesan. Silakan sampaikan keluhanmu.
                    </div>
                  ) : (
                    activeConsultation.messages.map((msg, idx) => {
                      const isMe = msg.senderId === user.uid;
                      const isCounselor = msg.senderId !== activeConsultation.userId;
                      
                      return (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex group ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}
                        >
                          <div className={`max-w-[85%] sm:max-w-[80%] p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] text-xs sm:text-sm italic leading-relaxed relative ${
                            isMe 
                              ? 'bg-brand-primary text-white rounded-tr-none shadow-md' 
                              : 'bg-white text-stone-700 border border-stone-100 rounded-tl-none card-shadow'
                          }`}>
                            {isCounselor && !isMe && (
                              <span className="text-[7px] font-black uppercase tracking-widest text-brand-primary block mb-1">
                                Guru BK / Admin
                              </span>
                            )}
                            <p>{msg.text}</p>
                            <span className={`text-[8px] mt-2 block font-black uppercase tracking-widest ${isMe ? 'text-white/80' : 'text-stone-500'}`}>
                              {msg.createdAt && (msg.createdAt.toDate ? msg.createdAt.toDate() : new Date(msg.createdAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {(isMe || isAdmin) && (
                            <button 
                              onClick={() => handleDeleteMessage(msg)}
                              className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 text-stone-300 hover:text-rose-500 transition-all self-center"
                              title="Hapus Pesan"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Chat Input */}
                {activeConsultation.status === ConsultationStatus.OPEN && (
                  <div className="p-4 sm:p-8 bg-white border-t border-stone-50">
                    <div className="relative">
                      <textarea 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan..."
                        className="w-full h-20 sm:h-24 p-4 sm:p-6 bg-brand-sidebar/30 rounded-[28px] sm:rounded-[32px] border-none focus:outline-none focus:ring-2 focus:ring-brand-accent/10 resize-none text-xs sm:text-sm italic"
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 w-10 h-10 sm:w-12 sm:h-12 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform disabled:opacity-50"
                      >
                        <Send size={16} className="sm:size-[18px]" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
