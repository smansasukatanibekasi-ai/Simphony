import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Bot, 
  Heart, 
  Leaf, 
  BookOpen, 
  Sparkles,
  LogOut,
  LogIn,
  Wind,
  Search,
  ShieldCheck
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, testConnection } from './lib/firebase';
import { UserProfile } from './types';

// Pages
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import ConsultationPage from './pages/ConsultationPage';
import ChatBotPage from './pages/ChatBotPage';
import HealthCornerPage from './pages/HealthCornerPage';
import RelaxationPage from './pages/RelaxationPage';
import GamificationPage from './pages/GamificationPage';
import ResearchPage from './pages/ResearchPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import Logo from './components/Logo';

function Navigation({ profile, logoUrl }: { profile: UserProfile | null, logoUrl: string | null }) {
  const location = useLocation();
  const isAdmin = profile?.isAdmin || false;

  const navItems = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Komunitas', path: '/komunitas', icon: Users },
    { name: 'Konsultasi Pribadi', path: '/konsultasi', icon: Heart },
    { name: 'Curhat Bot', path: '/bot', icon: MessageSquare },
    { name: 'Pojok Sehat', path: '/sehat', icon: Sparkles },
    { name: 'Relaksasi', path: '/relaksasi', icon: Wind },
    { name: 'Gamifikasi', path: '/game', icon: Leaf },
    { name: 'Info Riset', path: '/riset', icon: Search },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Panel Admin', path: '/admin', icon: ShieldCheck });
  }

  return (
    <>
      <nav id="desktop-nav" className="hidden lg:flex flex-col w-64 h-[calc(100vh-48px)] fixed top-6 left-6 bg-white/90 border border-stone-200/50 rounded-[32px] p-6 glass shadow-2xl shadow-stone-200/50 z-50">
        <div className="mb-10 px-2 flex items-center gap-3">
          <Logo logoUrl={logoUrl} size="sm" />
          <div>
            <h1 className="serif text-xl font-bold tracking-tight text-brand-primary">SIMPHONY</h1>
            <p className="text-[9px] uppercase tracking-widest text-brand-primary/80 font-bold leading-tight">Student Harmony</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`px-4 py-3 rounded-2xl flex items-center gap-3 font-bold text-xs transition-all duration-300 group ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-brand-secondary group-hover:scale-110 transition-transform'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-auto pt-6 border-t border-stone-100">
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-rose-600 transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </nav>

      <nav id="mobile-nav" className="lg:hidden fixed bottom-6 left-4 right-4 bg-white/90 border border-stone-200/50 h-16 rounded-3xl z-50 shadow-2xl glass flex items-center px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-8 mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                title={item.name}
                className={`flex flex-col items-center gap-1 transition-all flex-shrink-0 relative group ${
                  isActive ? 'text-brand-primary scale-110' : 'text-stone-500'
                }`}
              >
                <Icon size={20} />
                <span className={`text-[8px] font-black uppercase tracking-tighter transition-all ${
                  isActive ? 'opacity-100 h-auto px-1' : 'opacity-0 h-0 w-0 md:group-hover:opacity-100 md:group-hover:h-auto'
                }`}>
                  {item.name.split(' ')[0]}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator-mobile"
                    className="w-1 h-1 bg-brand-primary rounded-full mt-0.5"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function Header({ user, profile, logoUrl }: { user: any, profile: UserProfile | null, logoUrl: string | null }) {
  const location = useLocation();
  const getPageTitle = () => {
    if (location.pathname === '/') return '"Suaramu berharga, harimu bermakna."';
    if (location.pathname === '/komunitas') return 'Ruang Berbagi Cerita';
    if (location.pathname === '/konsultasi') return 'Bimbingan & Konseling';
    if (location.pathname === '/bot') return 'Teman Bicara Virtual';
    if (location.pathname === '/sehat') return 'Kesehatan & Kebugaran';
    if (location.pathname === '/relaksasi') return 'Ketenangan Jiwa';
    if (location.pathname === '/game') return 'Tumbuh Bersama';
    if (location.pathname === '/riset') return 'Inovasi untuk Negeri';
    return 'SIMPHONY';
  };

  return (
    <header className="px-4 md:px-8 py-4 md:py-6 flex justify-between items-center md:items-end mb-4">
      <div className="flex items-center gap-4 max-w-[70%]">
        <Logo logoUrl={logoUrl} size="md" className="lg:hidden" />
        <div className="max-w-full">
          <h2 className="serif text-xl md:text-4xl italic text-brand-primary leading-tight line-clamp-2 md:line-clamp-none">{getPageTitle()}</h2>
          <p className="hidden xs:block text-[8px] md:text-xs text-stone-700 mt-1 md:mt-2 italic font-medium">Aman, Terpercaya, dan Mendukung Pertumbuhanmu.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3 bg-white p-1 md:p-1.5 pr-3 md:pr-4 rounded-full border border-stone-100 shadow-sm">
          <img 
            src={user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
            alt="Profile" 
            className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-stone-100 shadow-inner"
          />
          <div className="text-left">
            <p className="text-[9px] md:text-[10px] font-bold text-stone-800 leading-none truncate max-w-[50px] md:max-w-none">
              {(profile?.displayName || user.displayName || 'User').split(' ')[0]}
            </p>
            <p className="text-[7px] md:text-[8px] text-brand-secondary font-bold uppercase tracking-tighter">
              {profile?.isAdmin ? 'Staff' : `LVL ${profile?.treeLevel || 1}`}
            </p>
          </div>
        </div>
        <button 
          onClick={() => auth.signOut()}
          className="lg:hidden w-9 h-9 bg-white rounded-full border border-stone-100 shadow-sm text-stone-600 hover:text-rose-600 transition-colors flex items-center justify-center flex-shrink-0"
          aria-label="Keluar"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'branding'));
        if (settingsDoc.exists()) {
          setLogoUrl(settingsDoc.data().logoUrl);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          const userDocRef = doc(db, 'users', authUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let userProfile: UserProfile;
          if (userDoc.exists()) {
            userProfile = userDoc.data() as UserProfile;
            const isAdmin = authUser.email === 'smansasukatanibekasi@gmail.com' || authUser.email === 'kemangsukatani7@gmail.com';
            if (userProfile.isAdmin !== isAdmin) {
              userProfile.isAdmin = isAdmin;
              await setDoc(userDocRef, { ...userProfile, isAdmin }, { merge: true });
            }
          } else {
            userProfile = {
              uid: authUser.uid,
              email: authUser.email!,
              displayName: authUser.displayName || 'Siswa',
              photoURL: authUser.photoURL || '',
              treeLevel: 1,
              lastWatered: null,
              isAdmin: authUser.email === 'smansasukatanibekasi@gmail.com' || authUser.email === 'kemangsukatani7@gmail.com'
            };
            await setDoc(userDocRef, userProfile);
          }
          setUser(authUser);
          setProfile(userProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-bg">
        <motion.div 
          animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="serif text-3xl italic text-brand-primary"
        >
          Resonansi...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage logoUrl={logoUrl} />;
  }

  return (
    <div className="flex min-h-screen bg-brand-bg text-[#2C2C2C]">
      <Navigation profile={profile} logoUrl={logoUrl} />
      
      <main className="flex-1 lg:pl-[280px] lg:pb-0 pb-32">
        <Header user={user} profile={profile} logoUrl={logoUrl} />
        
        <div className="px-6 md:px-10 pb-12 w-full">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage profile={profile} logoUrl={logoUrl} />} />
              <Route path="/komunitas" element={<CommunityPage user={user} profile={profile} />} />
              <Route path="/konsultasi" element={<ConsultationPage user={user} profile={profile} />} />
              <Route path="/bot" element={<ChatBotPage user={user} />} />
              <Route path="/sehat" element={<HealthCornerPage />} />
              <Route path="/relaksasi" element={<RelaxationPage user={user} profile={profile} />} />
              <Route path="/game" element={<GamificationPage profile={profile} />} />
              <Route path="/riset" element={<ResearchPage />} />
              <Route path="/admin" element={<AdminPage profile={profile} />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
