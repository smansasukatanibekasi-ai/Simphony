import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Send, User, ChevronRight, Quote, Heart, Trash2 } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { POSITIVE_RESONANCE, PEER_SUPPORTERS } from '../constants';
import { PeerMessage, UserProfile } from '../types';

export default function RelaxationPage({ user, profile }: { user: any, profile: UserProfile | null }) {
  const [currentQuote, setCurrentQuote] = useState(POSITIVE_RESONANCE[0]);
  const [selectedPeer, setSelectedPeer] = useState<typeof PEER_SUPPORTERS[0] | null>(null);
  const [peerMessage, setPeerMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<PeerMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const isAdmin = profile?.isAdmin || false;

  useEffect(() => {
    // Change quote every 10 seconds
    const interval = setInterval(() => {
      setCurrentQuote(prev => {
        const idx = POSITIVE_RESONANCE.indexOf(prev);
        return POSITIVE_RESONANCE[(idx + 1) % POSITIVE_RESONANCE.length];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user) return;
    const path = 'peer_messages';
    const q = isAdmin 
      ? query(collection(db, path), orderBy('createdAt', 'desc'))
      : query(collection(db, path), where('senderId', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PeerMessage[];
      setSentMessages(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleSendPeerMessage = async () => {
    if (!user || !selectedPeer || !peerMessage.trim()) return;

    setIsSending(true);
    const path = 'peer_messages';
    try {
      await addDoc(collection(db, path), {
        senderId: user.uid,
        senderName: user.displayName || 'Siswa',
        receiverId: selectedPeer.id,
        content: peerMessage,
        createdAt: serverTimestamp(),
      });
      setPeerMessage('');
      setSelectedPeer(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeletePeerMessage = async (msgId: string) => {
    const path = `peer_messages/${msgId}`;
    if (!window.confirm('Hapus resonansi ini?')) return;
    try {
      await deleteDoc(doc(db, 'peer_messages', msgId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-12 pb-20"
    >
      {/* Resonansi Positif */}
      <section id="resonance" className="relative h-[400px] flex items-center justify-center text-center p-8 glass rounded-[80px] border-white/50 shadow-2xl overflow-hidden card-shadow">
        <div className="absolute top-0 right-0 p-12 text-brand-primary opacity-5">
          <Sparkles size={240} />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuote}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            className="relative z-10 max-w-2xl space-y-8"
          >
            <div className="text-brand-accent text-3xl opacity-30">“</div>
            <h1 className="serif text-3xl md:text-5xl italic text-[#5A5A40] leading-tight font-medium">
              {currentQuote}
            </h1>
            <div className="text-brand-accent text-3xl opacity-30">”</div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-10 bg-brand-accent/30"></div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent">Aliran Resonansi</p>
              <div className="h-px w-10 bg-brand-accent/30"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Peer Support Section */}
      <section id="peer-support" className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="serif text-4xl italic text-brand-primary">Lend an Ear</h2>
            <p className="text-stone-500 italic text-sm">Pilih teman sebaya untuk berbagi resonansi secara personal.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {PEER_SUPPORTERS.map((peer) => (
              <button 
                key={peer.id}
                onClick={() => setSelectedPeer(peer)}
                className={`p-6 rounded-[32px] border transition-all text-left flex items-center gap-6 group relative overflow-hidden ${
                  selectedPeer?.id === peer.id 
                    ? 'bg-brand-cream border-brand-accent/30 card-shadow scale-[1.02]' 
                    : 'bg-white border-stone-100 hover:border-brand-accent/20'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                  selectedPeer?.id === peer.id ? 'bg-brand-primary text-white scale-110' : 'bg-brand-sidebar text-stone-400'
                }`}>
                  <span className="serif text-xl italic font-bold">{peer.name[0]}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#5A5A40] text-sm italic">{peer.name}</h3>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em] mt-0.5">Peer Advocate</p>
                </div>
                <ChevronRight size={16} className={`transition-transform duration-500 ${selectedPeer?.id === peer.id ? 'translate-x-2 text-brand-accent' : 'text-stone-200'}`} />
                
                {selectedPeer?.id === peer.id && (
                  <motion.div layoutId="peer-active-bg" className="absolute left-0 w-1 h-full bg-brand-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[450px]">
          <AnimatePresence mode="wait">
            {selectedPeer ? (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-10 rounded-[60px] border border-stone-100 card-shadow space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h3 className="serif text-2xl italic text-brand-primary">Surat untuk {selectedPeer.name.split(' ')[0]}</h3>
                  <button onClick={() => setSelectedPeer(null)} className="text-[9px] font-bold text-stone-300 uppercase tracking-widest hover:text-rose-400">Batal</button>
                </div>
                <textarea 
                  id="peer-msg-input"
                  value={peerMessage}
                  onChange={(e) => setPeerMessage(e.target.value)}
                  placeholder="Tuangkan apa yang kamu rasakan..."
                  className="w-full h-56 p-8 bg-brand-sidebar rounded-[40px] border-none focus:outline-none focus:ring-2 focus:ring-brand-accent/10 resize-none text-stone-700 italic text-sm leading-relaxed"
                />
                <button 
                  onClick={handleSendPeerMessage}
                  disabled={!peerMessage.trim() || isSending}
                  className="w-full bg-brand-primary text-white py-5 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send size={14} className="inline mr-2" />
                  Kirim Resonansi
                </button>
                <div className="flex items-center gap-4 p-5 bg-[#FAFAE0] rounded-3xl border border-[#E9EDC9]">
                  <div className="text-brand-accent opacity-50"><Heart size={20} fill="currentColor" /></div>
                  <p className="text-[9px] text-[#5A5A40] leading-normal italic font-medium">
                    Balasan akan dikirimkan secara tertutup melalui email resmi: <strong>kemangsukatani7@gmail.com</strong>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-[60px] border-white/50 p-10 h-full flex flex-col card-shadow"
              >
                <h3 className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.3em] mb-10 text-center">Jejak Resonansi</h3>
                <div className="flex-1 space-y-6">
                  {sentMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-20">
                      <div className="text-6xl">✉</div>
                      <p className="text-xs italic">Belum ada surat yang terkirim hari ini.</p>
                    </div>
                  ) : (
                    sentMessages.slice(0, 6).map((msg) => (
                      <div key={msg.id} className="bg-white/60 p-6 rounded-[32px] border border-stone-50 shadow-sm relative group">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[8px] font-bold text-brand-accent uppercase tracking-widest leading-none">
                            {isAdmin ? `DARI: ${msg.senderName} ➜ ` : ''}Kepada {PEER_SUPPORTERS.find(p => p.id === msg.receiverId)?.name || msg.receiverId}
                          </span>
                          <span className="text-[8px] text-stone-300 font-bold">{msg.createdAt?.toDate().toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-2 italic leading-relaxed">"{msg.content}"</p>
                        
                        {(isAdmin || msg.senderId === user.uid) && (
                          <button 
                            onClick={() => handleDeletePeerMessage(msg.id!)}
                            className="absolute -top-2 -right-2 bg-white text-stone-300 hover:text-rose-500 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                            title="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {sentMessages.length > 0 && (
                  <p className="text-[8px] text-center text-stone-300 font-bold uppercase tracking-widest mt-8">
                    {isAdmin ? `Menampilkan ${sentMessages.length} total resonansi` : 'Hanya menampilkan resonansi terbaru'}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
}
