import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Heart, MessageCircle, User, Share2, Plus, X, Trash2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Post, UserProfile } from '../types';

export default function CommunityPage({ user, profile }: { user: any, profile: UserProfile | null }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const isAdmin = profile?.isAdmin || false;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const path = 'posts';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, [user]);

  const handlePost = async () => {
    if (!user || !newPostContent.trim()) return;

    const path = 'posts';
    try {
      await addDoc(collection(db, path), {
        authorId: user.uid,
        authorName: user.displayName || 'Siswa',
        content: newPostContent,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      });
      setNewPostContent('');
      setIsPosting(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const handleLike = async (post: Post) => {
    if (!user) return;
    const path = `posts/${post.id}`;
    const postRef = doc(db, 'posts', post.id!);
    const isLiked = post.likes.includes(user.uid);

    try {
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    const path = `posts/${postId}`;
    
    if (!window.confirm('Hapus cerita ini?')) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleComment = async (postId: string) => {
    if (!user || !newComment.trim()) return;

    const path = `posts/${postId}`;
    const postRef = doc(db, 'posts', postId);

    try {
      await updateDoc(postRef, {
        comments: arrayUnion({
          id: Math.random().toString(36).substring(2, 9),
          authorId: user.uid,
          authorName: user.displayName || 'Siswa',
          content: newComment,
          createdAt: Timestamp.now()
        })
      });
      setNewComment('');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-3xl mx-auto space-y-8 pb-20"
    >
      <div className="flex justify-between items-end bg-brand-sidebar p-8 rounded-[40px] border border-stone-200 card-shadow">
        <div>
          <h1 className="serif text-4xl italic text-brand-primary">Komunitas</h1>
          <p className="text-stone-500 italic mt-1">Berbagi cerita dan inspirasi positif.</p>
        </div>
        <button 
          id="btn-create-post"
          onClick={() => setIsPosting(true)}
          className="bg-brand-primary text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-brand-primary/20"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isPosting && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass p-8 rounded-[40px] border-white/50 shadow-2xl relative z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="serif text-2xl italic text-brand-primary">Tulis Ceritamu</h2>
              <button 
                onClick={() => setIsPosting(false)}
                className="p-2 hover:bg-stone-100 rounded-full text-stone-400"
              >
                <X size={20} />
              </button>
            </div>
            <textarea 
              id="input-post-content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Apa yang ada dalam benakmu saat ini? Bagikan ceritamu dengan tenang..."
              className="w-full h-40 p-6 bg-white/50 rounded-[32px] border border-stone-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 resize-none text-stone-700 italic text-sm"
            />
            <div className="flex justify-end gap-6 mt-6">
              <button 
                onClick={() => setIsPosting(false)}
                className="text-[10px] uppercase tracking-widest font-bold text-stone-400"
              >
                Batal
              </button>
              <button 
                onClick={handlePost}
                disabled={!newPostContent.trim()}
                className="bg-brand-primary text-white px-10 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/20 disabled:opacity-50"
              >
                Kirim Cerita
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="posts-list" className="space-y-8">
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Meresonansi Cerita...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-brand-cream border-2 border-dashed border-brand-accent/20 rounded-[40px]">
            <div className="text-4xl mb-4 opacity-30">🍃</div>
            <p className="text-stone-500 italic">Belum ada cerita di sini. Jadilah yang pertama menyebarkan harmoni.</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div 
              id={`post-${post.id}`}
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[40px] border border-stone-100 card-shadow hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-sidebar rounded-full flex items-center justify-center text-brand-primary border border-stone-100 text-lg">
                    {post.authorName[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-800">{post.authorName}</h3>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-medium">
                      {post.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>

                {(post.authorId === user?.uid || isAdmin) && (
                  <button 
                    onClick={() => handleDeletePost(post.id!)}
                    className="p-2 text-stone-300 hover:text-rose-500 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <p className="text-stone-600 leading-relaxed mb-8 whitespace-pre-wrap italic text-sm">{post.content}</p>
              
              <div className="flex items-center gap-8 pt-6 border-t border-stone-50">
                <button 
                  onClick={() => handleLike(post)}
                  className={`flex items-center gap-2 group transition-colors ${
                    post.likes.includes(user?.uid) ? 'text-brand-secondary' : 'text-stone-400'
                  }`}
                >
                  <Heart 
                    size={18} 
                    fill={post.likes.includes(user?.uid) ? 'currentColor' : 'none'} 
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="text-xs font-bold">{post.likes.length}</span>
                </button>
                <button 
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : (post.id || null))}
                  className={`flex items-center gap-2 transition-colors ${
                    activeCommentPostId === post.id ? 'text-brand-primary' : 'text-stone-400 hover:text-brand-primary'
                  }`}
                >
                  <MessageCircle size={18} />
                  <span className="text-xs font-bold">
                    {(post.comments?.length || 0) > 0 ? `${post.comments.length} Komentar` : 'Komentar'}
                  </span>
                </button>
                <div className="ml-auto text-brand-accent/40">
                  <Share2 size={16} />
                </div>
              </div>

              <AnimatePresence>
                {activeCommentPostId === post.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 space-y-6">
                      <div className="space-y-4">
                        {post.comments?.map((comment) => (
                          <div key={comment.id} className="flex gap-3 items-start bg-stone-50/50 p-4 rounded-3xl border border-stone-100/50">
                            <div className="w-8 h-8 bg-brand-sidebar rounded-full flex items-center justify-center text-brand-primary text-xs shrink-0 border border-stone-100">
                              {comment.authorName[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-stone-700">{comment.authorName}</span>
                                <span className="text-[9px] text-stone-400">
                                  {comment.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 italic">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <input 
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id!)}
                          placeholder="Tulis komentar..."
                          className="flex-1 bg-stone-100 border-none rounded-full px-5 py-2 text-xs focus:ring-1 focus:ring-brand-accent placeholder:text-stone-400 italic"
                        />
                        <button 
                          onClick={() => handleComment(post.id!)}
                          disabled={!newComment.trim()}
                          className="bg-brand-primary text-white p-2 rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
