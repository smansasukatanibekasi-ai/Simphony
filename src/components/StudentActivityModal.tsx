import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Search, User, Shield, MessageSquare, Heart, Sparkles, Home, 
  Users, CheckCircle2, Clock, ChevronRight, ExternalLink, Calendar, 
  Filter, AlertTriangle, ArrowUpDown, MessageCircle, Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile, Consultation, Post, PeerMessage, ConsultationCategory, ConsultationStatus } from '../types';

interface StudentActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  consultations: Consultation[];
  posts: Post[];
  peerMessages: PeerMessage[];
}

const CATEGORY_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  [ConsultationCategory.BULLYING]: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  [ConsultationCategory.CIRCLE]: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  [ConsultationCategory.KELUARGA]: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  [ConsultationCategory.PRIBADI]: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  [ConsultationCategory.DIRECT_BK]: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

export default function StudentActivityModal({
  isOpen,
  onClose,
  users,
  consultations,
  posts,
  peerMessages
}: StudentActivityModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [expandedConsultationId, setExpandedConsultationId] = useState<string | null>(null);

  // Combine registered users with any distinct userIds from consultations/posts
  const enrichedStudents = useMemo(() => {
    const studentMap = new Map<string, {
      uid: string;
      displayName: string;
      email: string;
      photoURL?: string;
      treeLevel?: number;
      isAdmin?: boolean;
      consultations: Consultation[];
      posts: Post[];
      peerMessages: PeerMessage[];
      consultedCategories: Set<string>;
    }>();

    // Seed from users
    users.forEach(u => {
      studentMap.set(u.uid, {
        uid: u.uid,
        displayName: u.displayName || 'Siswa',
        email: u.email || '-',
        photoURL: u.photoURL,
        treeLevel: u.treeLevel || 1,
        isAdmin: u.isAdmin,
        consultations: [],
        posts: [],
        peerMessages: [],
        consultedCategories: new Set<string>()
      });
    });

    // Populate consultations
    consultations.forEach(c => {
      let entry = studentMap.get(c.userId);
      if (!entry) {
        entry = {
          uid: c.userId,
          displayName: c.userName || 'Siswa',
          email: '-',
          consultations: [],
          posts: [],
          peerMessages: [],
          consultedCategories: new Set<string>()
        };
        studentMap.set(c.userId, entry);
      }
      entry.consultations.push(c);
      if (c.category) {
        entry.consultedCategories.add(c.category);
      }
    });

    // Populate posts
    posts.forEach(p => {
      let entry = studentMap.get(p.authorId);
      if (entry) {
        entry.posts.push(p);
      }
    });

    // Populate peer messages
    peerMessages.forEach(m => {
      let entry = studentMap.get(m.senderId);
      if (entry) {
        entry.peerMessages.push(m);
      }
    });

    return Array.from(studentMap.values());
  }, [users, consultations, posts, peerMessages]);

  // Filter students based on search and category
  const filteredStudents = useMemo(() => {
    return enrichedStudents.filter(student => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = student.displayName.toLowerCase().includes(query) || 
                            student.email.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (filterCategory === 'all') return true;
      if (filterCategory === 'has_consultation') return student.consultations.length > 0;
      if (filterCategory === 'has_posts') return student.posts.length > 0;
      if (filterCategory === 'open_case') return student.consultations.some(c => c.status === ConsultationStatus.OPEN);
      return student.consultedCategories.has(filterCategory);
    });
  }, [enrichedStudents, searchQuery, filterCategory]);

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) {
      return filteredStudents[0] || null;
    }
    return enrichedStudents.find(s => s.uid === selectedStudentId) || filteredStudents[0] || null;
  }, [selectedStudentId, enrichedStudents, filteredStudents]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white w-full max-w-6xl h-[90vh] rounded-[36px] sm:rounded-[44px] shadow-2xl flex flex-col overflow-hidden border border-stone-100"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-8 bg-stone-50/80 border-b border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-sm">
                <Users size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="serif text-xl sm:text-2xl italic font-bold text-brand-primary">
                    Aktivitas & Riwayat Konsultasi Siswa
                  </h2>
                  <span className="text-[10px] font-bold bg-brand-sidebar text-brand-primary px-2.5 py-0.5 rounded-full">
                    {enrichedStudents.length} Siswa Terdata
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium italic mt-0.5">
                  Pantau siswa yang mengakses aplikasi, fitur yang digunakan, serta rincian masalah yang dikonsultasikan.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white hover:bg-stone-200/60 text-stone-500 transition-colors self-end md:self-auto border border-stone-200/50 shadow-xs"
              title="Tutup Modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="px-5 sm:px-8 py-3.5 bg-white border-b border-stone-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau email siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter size={12} /> Filter:
              </span>
              {[
                { label: 'Semua', val: 'all' },
                { label: 'Pernah Konsultasi', val: 'has_consultation' },
                { label: '⚠️ Kasus Terbuka (Open)', val: 'open_case' },
                { label: 'Bullying', val: ConsultationCategory.BULLYING },
                { label: 'Circle', val: ConsultationCategory.CIRCLE },
                { label: 'Keluarga', val: ConsultationCategory.KELUARGA },
                { label: 'Pribadi', val: ConsultationCategory.PRIBADI },
              ].map(f => (
                <button
                  key={f.val}
                  onClick={() => setFilterCategory(f.val)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl shrink-0 transition-all ${
                    filterCategory === f.val 
                      ? 'bg-brand-primary text-white shadow-xs' 
                      : 'bg-stone-100 hover:bg-stone-200/70 text-stone-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Main Content: Split Master-Detail */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Student List */}
            <div className="w-full md:w-5/12 border-r border-stone-100 overflow-y-auto p-4 sm:p-6 space-y-3 bg-stone-50/40">
              <div className="flex justify-between items-center px-1 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Daftar Siswa ({filteredStudents.length})
                </span>
                <span className="text-[10px] text-stone-400 italic">Pilih siswa untuk lihat detail</span>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-stone-200">
                  <User size={32} className="mx-auto text-stone-300 mb-2" />
                  <p className="text-xs font-bold text-stone-600">Tidak ada siswa ditemukan</p>
                  <p className="text-[11px] text-stone-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter.</p>
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const isSelected = selectedStudent?.uid === student.uid;
                  const hasOpenCase = student.consultations.some(c => c.status === ConsultationStatus.OPEN);

                  return (
                    <button
                      key={student.uid}
                      onClick={() => setSelectedStudentId(student.uid)}
                      className={`w-full text-left p-4 rounded-3xl transition-all border flex flex-col gap-2.5 ${
                        isSelected 
                          ? 'bg-white border-brand-primary shadow-md ring-2 ring-brand-primary/10' 
                          : 'bg-white hover:bg-stone-50 border-stone-200/70 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {student.photoURL ? (
                          <img src={student.photoURL} alt={student.displayName} className="w-10 h-10 rounded-2xl object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-brand-sidebar text-brand-primary flex items-center justify-center font-bold text-sm shrink-0">
                            {student.displayName[0] || 'S'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-stone-800 truncate">{student.displayName}</p>
                            {student.isAdmin && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-purple-100 text-purple-700 rounded-md shrink-0">Admin</span>
                            )}
                          </div>
                          <p className="text-[10px] text-stone-400 truncate">{student.email}</p>
                        </div>

                        {hasOpenCase && (
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" title="Ada konsultasi aktif yang belum ditutup" />
                        )}
                      </div>

                      {/* Usage Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-stone-100">
                        {student.consultations.length > 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 flex items-center gap-1">
                            <Heart size={10} /> {student.consultations.length} Konsultasi
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400 px-2 py-0.5 rounded-lg bg-stone-100">
                            Belum Konsultasi
                          </span>
                        )}

                        {student.posts.length > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center gap-1">
                            <MessageSquare size={10} /> {student.posts.length} Cerita
                          </span>
                        )}

                        {student.peerMessages.length > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 flex items-center gap-1">
                            <Sparkles size={10} /> {student.peerMessages.length} Resonansi
                          </span>
                        )}

                        {student.treeLevel && student.treeLevel > 1 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-brand-sidebar text-brand-primary flex items-center gap-1">
                            <Leaf size={10} /> Lvl {student.treeLevel}
                          </span>
                        )}
                      </div>

                      {/* Problem topics chips */}
                      {student.consultations.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {Array.from(student.consultedCategories).map((cat: string) => {
                            const style = CATEGORY_COLORS[cat] || { bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-200' };
                            return (
                              <span key={cat} className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${style.bg} ${style.text}`}>
                                • {cat}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Right Column: Selected Student Detail */}
            <div className="w-full md:w-7/12 overflow-y-auto p-5 sm:p-8 bg-white space-y-6">
              {selectedStudent ? (
                <>
                  {/* Student Profile Card */}
                  <div className="p-6 rounded-3xl bg-brand-sidebar/30 border border-brand-accent/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      {selectedStudent.photoURL ? (
                        <img src={selectedStudent.photoURL} alt={selectedStudent.displayName} className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-xs" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
                          {selectedStudent.displayName[0] || 'S'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="serif text-xl font-bold text-stone-900">{selectedStudent.displayName}</h3>
                          {selectedStudent.isAdmin && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">Admin BK</span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">{selectedStudent.email}</p>
                        <p className="text-[10px] text-brand-primary font-bold mt-1">ID Siswa: {selectedStudent.uid}</p>
                      </div>
                    </div>

                    <Link
                      to="/konsultasi"
                      onClick={onClose}
                      className="px-4 py-2 bg-brand-primary hover:bg-brand-accent text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0"
                    >
                      <MessageCircle size={14} />
                      <span>Buka Panel Konsultasi BK</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>

                  {/* Feature Usage Overview */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-brand-primary" />
                      Fitur SIMPHONY yang Digunakan Siswa
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
                        <p className="text-[10px] text-stone-400 uppercase font-black">Konsultasi BK</p>
                        <p className="text-xl font-bold text-stone-800 mt-1">{selectedStudent.consultations.length}x</p>
                        <p className="text-[10px] text-rose-600 font-bold">
                          {selectedStudent.consultations.filter(c => c.status === ConsultationStatus.OPEN).length} sesi aktif
                        </p>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
                        <p className="text-[10px] text-stone-400 uppercase font-black">Cerita Komunitas</p>
                        <p className="text-xl font-bold text-stone-800 mt-1">{selectedStudent.posts.length}x</p>
                        <p className="text-[10px] text-stone-400 italic">Post curhat publik</p>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
                        <p className="text-[10px] text-stone-400 uppercase font-black">Peer Support</p>
                        <p className="text-xl font-bold text-stone-800 mt-1">{selectedStudent.peerMessages.length}x</p>
                        <p className="text-[10px] text-stone-400 italic">Pesan relaksasi</p>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
                        <p className="text-[10px] text-stone-400 uppercase font-black">Pohon Harmoni</p>
                        <p className="text-xl font-bold text-brand-primary mt-1">Level {selectedStudent.treeLevel || 1}</p>
                        <p className="text-[10px] text-stone-400 italic">Gamifikasi diri</p>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Problems Detail */}
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                          <Heart size={14} className="text-rose-600" />
                          Rincian Masalah yang Dikonsultasikan
                        </h4>
                        <p className="text-[11px] text-stone-500 italic">
                          Daftar topik permasalahan dan riwayat percakapan dengan Guru BK
                        </p>
                      </div>
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
                        {selectedStudent.consultations.length} Kasus
                      </span>
                    </div>

                    {selectedStudent.consultations.length === 0 ? (
                      <div className="p-8 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                        <Heart size={28} className="mx-auto text-stone-300 mb-2" />
                        <p className="text-xs font-bold text-stone-700">Siswa ini belum pernah berkonsultasi</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Siswa baru mengakses fitur lain atau belum mengajukan sesi bimbingan kepada Guru BK.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedStudent.consultations.map((c, idx) => {
                          const isExpanded = expandedConsultationId === (c.id || idx.toString());
                          const style = CATEGORY_COLORS[c.category] || { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' };
                          const firstStudentMessage = c.messages?.find(m => m.senderId === selectedStudent.uid) || c.messages?.[0];

                          return (
                            <div 
                              key={c.id || idx} 
                              className={`rounded-2xl border transition-all overflow-hidden ${style.border} bg-white shadow-xs`}
                            >
                              {/* Consultation Item Header */}
                              <div 
                                onClick={() => setExpandedConsultationId(isExpanded ? null : (c.id || idx.toString()))}
                                className="p-4 cursor-pointer hover:bg-stone-50/70 flex items-start justify-between gap-3"
                              >
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${style.bg} ${style.text}`}>
                                      {c.category}
                                    </span>
                                    {c.status === ConsultationStatus.OPEN ? (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                                        <Clock size={11} /> Sesi Terbuka / Aktif
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                        <CheckCircle2 size={11} /> Kasus Selesai
                                      </span>
                                    )}
                                    <span className="text-[10px] text-stone-400">
                                      {c.messages?.length || 0} pesan
                                    </span>
                                  </div>

                                  {/* Preview of first message */}
                                  {firstStudentMessage && (
                                    <p className="text-xs text-stone-700 italic line-clamp-1 bg-stone-50 p-2 rounded-xl">
                                      "{firstStudentMessage.text}"
                                    </p>
                                  )}
                                </div>

                                <ChevronRight 
                                  size={18} 
                                  className={`text-stone-400 transition-transform mt-1 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} 
                                />
                              </div>

                              {/* Expanded Chat History */}
                              {isExpanded && (
                                <div className="p-4 bg-stone-50/90 border-t border-stone-100 space-y-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                    Riwayat Percakapan Konsultasi:
                                  </p>

                                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {c.messages && c.messages.length > 0 ? (
                                      c.messages.map((m, mIdx) => {
                                        const isFromStudent = m.senderId === selectedStudent.uid;
                                        return (
                                          <div 
                                            key={mIdx} 
                                            className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                              isFromStudent 
                                                ? 'bg-white border border-stone-200 text-stone-800 ml-0 mr-8' 
                                                : 'bg-brand-primary text-white ml-8 mr-0'
                                            }`}
                                          >
                                            <div className="flex justify-between items-center text-[10px] opacity-70 mb-1">
                                              <span className="font-bold">{m.senderName} ({isFromStudent ? 'Siswa' : 'Guru BK'})</span>
                                            </div>
                                            <p>{m.text}</p>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <p className="text-xs text-stone-400 italic">Belum ada pesan tercatat dalam sesi ini.</p>
                                    )}
                                  </div>

                                  <div className="pt-2 flex justify-end">
                                    <Link
                                      to="/konsultasi"
                                      onClick={onClose}
                                      className="text-xs font-bold text-brand-primary hover:text-brand-accent flex items-center gap-1"
                                    >
                                      <span>Tanggapi di Menu Konsultasi Pribadi</span>
                                      <ChevronRight size={13} />
                                    </Link>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Stories in Community (if any) */}
                  {selectedStudent.posts.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                        <MessageSquare size={14} className="text-emerald-600" />
                        Cerita yang Diposting di Komunitas ({selectedStudent.posts.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedStudent.posts.map((p, pIdx) => (
                          <div key={p.id || pIdx} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-700">
                            <p className="italic leading-relaxed">"{p.content}"</p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-stone-400">
                              <span>❤️ {p.likes?.length || 0} suka</span>
                              <span>💬 {p.comments?.length || 0} komentar</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-8">
                  <div>
                    <User size={40} className="mx-auto text-stone-300 mb-2" />
                    <p className="text-sm font-bold text-stone-600">Pilih salah satu siswa dari daftar di sebelah kiri</p>
                    <p className="text-xs text-stone-400 mt-1">Detail aktivitas dan masalah yang dikonsultasikan akan ditampilkan di sini.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
