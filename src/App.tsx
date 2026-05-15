import { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Settings, 
  Plus, 
  Search, 
  FolderOpen, 
  SlidersHorizontal, 
  Play, 
  Edit2, 
  ChevronRight, 
  Sun, 
  Moon, 
  Cloud, 
  LogOut, 
  Maximize2, 
  Lock, 
  FlipHorizontal, 
  Eraser, 
  Video,
  Library as LibraryIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type View = 'HOME' | 'LIBRARY' | 'SETTINGS' | 'CAMERA';

interface Session {
  id: string;
  title: string;
  lastEdited: string;
  refImage: string;
  progressImage?: string;
  status: 'continue' | 'start';
}

interface Reference {
  id: string;
  title: string;
  category: string;
  image: string;
  isFeatured?: boolean;
}

// --- Mock Data ---

const SESSIONS: Session[] = [
  {
    id: '1',
    title: 'Classical Bust Study',
    lastEdited: 'Oct 24, 2023',
    refImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2FwTgA35RDQgKtWEj6TpOa6Kr1omnFUPBaCmjBeK2LmkzCBPc9vFNHRa2chaLkS7MDjdQg_Zt4qmndxtMFbbqi7AV59WsE8Q3goixJINDqGJjKRXXALEq3rv4IFyZWpvhjbC0kjUET0j-k3cHbiwjLvFgWoQmp4H6lD64pvx-Jrej95QfESzd9Dso3-OlE6PQb2Xy5WUhpn6-ytotDnzH2MNFGXG6wxKartMF46GqZ5biNzwPyVyGOY8TnFoaUfHAfnP4mInzYJo',
    progressImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm6Kf870Pb7Pq-9t1h-947zXEsYFyFy6UfQtV5Aztf-aISuODIayzq6Cc42f2RgvDjThTE0q1djHDXONTIEREY3JThd6EifpgV1QIAg3FEy0lYpBakx-LAJ5ofWa9D90NVQd1apr_6jxp68lZl3sJkQaue95wXUjhm7uM6pURZjQCzhujEV0rkxoLa0uspLqXjFpX5wJSlWw53WlwnDvqfzs-Ym7HqgFva5XLxev4kXNwLNSZi8ar3oiHSXdFkh7LI33p1rXWd0Jk',
    status: 'continue'
  },
  {
    id: '2',
    title: 'Evening Forest Path',
    lastEdited: 'Oct 20, 2023',
    refImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcUQaXFAwYwFthtEMa0q0I9LW8A9m1O1q6JQkqqwh5dnY0lEPsZyf6K6A2uEsTtufwjsXz_0SijFVwcyOp_MB867xrWprnwsW8qNC83VOTj6jjL0uxXAbC2EjAJzbrGwJS3PhsMSbJmkQZsKXyuouUhP4L6pjBgvBxyGEZAPvaxr7zsvmH-e2ACKatUPfXW8QO98e086DSyqhwZY_a06BpNAfOEpsw19KZeRVapzWFoALikOPRA3LzK9qRk_X0W-TmquyY0VaGnsY',
    progressImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO6p9B6vv7EnxFEjF9pweJUgOJzCksY_ZZWWLsMhKSqD-Mur_ne_kdSgFHsX3AKtXghonpzF0I1Kx776d-nOoB2SPKMlSxhk7G2aeCp5JOfvpk-gKKZLII3-ol67YkF3c6nOi-iWv7p4ArnwLw601-Ug2Q-xWKm-VQObHGYVZhWd_1gPgmrzNaEACPduzMZwZfVpXT5kboARyeCqoWlF5hXi-gcDfzclgON9sdzGZQlA3x0yS5h4KTLzHexgUNucZ3GfOXjMJ37Ag',
    status: 'continue'
  },
  {
    id: '3',
    title: 'Abstract Form #4',
    lastEdited: 'Started Oct 18, 2023',
    refImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq9TMubLzNMmT6XSO2hfRjM0is5-qth54I_hLVv_i2hVIbDZTNCpS6Z2mqkazVZzmhAp4GBkoGq-yd2jDXMblfjvJagDROApV4ReON0n0vRO4K4ytrXdhgpGN3chLqk-Yreo54nIJZZ4akHlFxXfgMylOA0T3KkayiGnN6k3rrclUBRvxU9uHkB1DYS9qbfdtpstB210visGv2WiPfDmGQCuPk4phLm6bL3OY4EPdY5XPz5X51uLqRAEM6DuzK8p8z6GO64BiHahw',
    status: 'start'
  }
];

const REFERENCES: Reference[] = [
  {
    id: 'r1',
    title: 'The Stoic Elder',
    category: 'Featured Portrait',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4kTa7DSCgPbm2HGg0--PZwPcm0Xr3U7idTx-CEylc6xMMmSk8jNX-4MBm0Q-_9Ph7DchnadQcewTGxwRnkJ-q4wW2HHYysF65OmsCJi8QuOhT_O3P5NZvE-fC2qFZ6vlBRKbPWg0HP6B1he_j_vxOajJjz3sr8E1UG0g51E8o6kklp3bUd-KCT-f-L6JxilI0ddQGNvk48xpkKZAVt3XLYC4OB9HGS010Q_Mfyo73VYTsfemoijvo7HRvcBr7VrivmZ_CfJMjHp4',
    isFeatured: true
  },
  {
    id: 'r2',
    title: 'Mountain Crest',
    category: 'Landscape',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB5oB168YEFSxU15lmRdCs4rMiJV6TWTR6jQg1kiXo_lkLRL3ijGrsEuymwvcrbrMdksPkbYTuVfdYtQks45_GoPgHPtjN6dutOigVwIIABwiYS_Q17ZWqRAvDliaZxcXzrb7GfdXI295mslAynX0YhzcP9btN9_rHNsy0X7wp9L7MSy5RpmbVwZ0hOa7M5r228lfyw-v98jqc7dzoGhyHwE376RYciKiTEIF9Po4TLOm5rbA0UUkneXFhqH6q8NPOPmVtLFihVDM'
  },
  {
    id: 'r3',
    title: 'Hand Anatomy',
    category: 'Anatomy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuISDBOSbLGqzLmvrLJif53wTqx0MDiyoSDuwpbG4NUqD_K3TZmbe8WB7-PwPa6pWn1JnQSCqdfSROB2QDn3RSnU80OjwWUX1zL8M7oIdVReChaxt0AwJOdxEWkPmx_1kom1k8mXaggRyfC3949BVnMq6nICMi1lT5wIumMyResPps1X9iCqOVGhcgiPBrfim1lwTzbXsz5DyMY0pzVLLnkyQZGK4FeCfXlDuw92Ml2-6vc6OPshGDjD8Ra73oFIuFpz1wcUYvD10'
  },
  {
    id: 'r4',
    title: 'Urban Glass',
    category: 'Architecture',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSl75TNDjbUx3gmV8I4ArVQzR6kYRFr1_aV3lmodYIwIJkxQRcxZrJJ_X8ZCNqf8CPetYM8XlGEsO_4htYboDOt4t3O8d6SaOiX8NbbLhHyfXqgpXRObhB7Gq7bJ86HCOrXOldiqhO6KrFgMkZNpiSLRKQfJD3eTApI8lAhcTcYQfOyI3jMMrF_8zgM3SKzb09wHwdqsBQ2dDns7ydWzfWowph8VD9CkkrXkixjsyNEsGA9OB_VG6iEaoL_iYRQ13Wwd5FY-HGbrE'
  },
  {
    id: 'r5',
    title: 'Flora Study',
    category: 'Botanical',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOyIxvTtlptLxHyfEORFE19onrhjhOFtAVRaB24PupQZiJO207Q6h1gC7MIHGENQB7rarki_WHlzqCigOWXs4PoHSoukyk_7rAl1IWUtaV2LHMF7y4Ip7LrCSUPC98W9l44rWhMu0hixuiAJsTRCC5z0fzFucHxWSd_rAzEQRu82sQRxoz2a55_O7KrCYdoB4NFyT4j4pYzm94PlXYeGLbB7kc9GH5Afc4GwenJk4Ce1dpKemnnW9zOKHnc4uwNJIR8pa14-DGrb4'
  },
  {
    id: 'r6',
    title: 'Abstract Profile',
    category: 'Portrait',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcVwivhDNhtD0BhXdUmsgR-HfqAZ4kGckdfve8lJRmeIXro-r0Zcci62v9TobEqLBMra5pmK4ptiaf2Q7lbfMZgtFaQHU-PnFeNExnzm-qkODULGvY5ct9gu2Dd9qwvVQ25R7yfpQ_zYrNpFb21aIlNfQ5-UGnmx9gihNuwcaWWOh9UvkLd5Gg-MyHMwZNKnk9nn8fuSoQjZ6ka21s7OVNx80iFtS-yucQx1k4pkGgT9vzsFV0fBuneORmJVQpbUcTjYRT_qMM0qo'
  }
];

// --- Components ---

const NavBar = ({ currentView, onViewChange }: { currentView: View, onViewChange: (v: View) => void }) => {
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 flex justify-around items-center h-16 bg-surface/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl max-w-7xl mx-auto">
      <button 
        onClick={() => onViewChange('CAMERA')}
        className={`p-3 transition-all duration-200 active:scale-95 ${currentView === 'CAMERA' ? 'bg-primary/20 text-primary rounded-full' : 'text-on-surface-variant hover:text-primary'}`}
      >
        <Camera size={24} />
      </button>
      <button 
        onClick={() => onViewChange('LIBRARY')}
        className={`p-3 transition-all duration-200 active:scale-95 ${currentView === 'LIBRARY' ? 'bg-primary/20 text-primary rounded-full' : 'text-on-surface-variant hover:text-primary'}`}
      >
        <LibraryIcon size={24} />
      </button>
      <button 
        onClick={() => onViewChange('HOME')}
        className={`p-3 transition-all duration-200 active:scale-95 ${currentView === 'HOME' ? 'bg-primary/20 text-primary rounded-full' : 'text-on-surface-variant hover:text-primary'}`}
      >
        <FolderOpen size={24} />
      </button>
      <button 
        onClick={() => onViewChange('SETTINGS')}
        className={`p-3 transition-all duration-200 active:scale-95 ${currentView === 'SETTINGS' ? 'bg-primary/20 text-primary rounded-full' : 'text-on-surface-variant hover:text-primary'}`}
      >
        <SlidersHorizontal size={24} />
      </button>
    </nav>
  );
};

const TopBar = ({ onViewChange }: { onViewChange: (v: View) => void }) => {
  return (
    <header className="fixed top-4 left-4 right-4 rounded-xl z-50 glass-panel h-14 flex items-center justify-between px-6 max-w-7xl mx-auto shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-[#8E793E] flex items-center justify-center">
          <Camera size={16} className="text-on-primary" />
        </div>
        <span className="font-light text-xl text-on-surface tracking-[0.3em] uppercase">TraceCam</span>
      </div>
      <button 
        onClick={() => onViewChange('SETTINGS')}
        className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full active:scale-95 duration-200"
      >
        <Settings size={20} />
      </button>
    </header>
  );
};

// --- Screens ---

const HomeScreen = ({ onAction }: { onAction: (s: Session) => void }) => {
  return (
    <div className="pt-28 pb-32 px-6 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-semibold">Exhibition Overview</div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">Drawing Sessions</h1>
        </div>
        <div className="flex gap-4">
          <div className="pill-style opacity-60">Curated Work</div>
          <div className="pill-style opacity-60">Oct - Dec 2023</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SESSIONS.map((session) => (
          <div key={session.id} className="glass-panel rounded-3xl overflow-hidden flex flex-col group transition-all hover:bg-white/5">
            <div className="relative flex h-64 bg-surface-container-low">
              <div className={`relative overflow-hidden border-r border-white/5 ${session.progressImage ? 'w-1/2' : 'w-full'}`}>
                <img src={session.refImage} alt="Reference" className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute top-4 left-4 pill-style bg-black/60 backdrop-blur-md">
                  Reference
                </div>
              </div>
              {session.progressImage && (
                <div className="w-1/2 relative overflow-hidden">
                  <img src={session.progressImage} alt="Progress" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-4 left-4 pill-style bg-primary/20 text-primary border-primary/40 backdrop-blur-md font-bold">Progress</div>
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-light text-on-surface tracking-tight group-hover:accent-text transition-colors">{session.title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-50 mt-1">{session.lastEdited}</p>
              </div>
              <button 
                onClick={() => onAction(session)}
                className="mt-2 w-full bg-primary text-on-primary py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/10 hover:brightness-110"
              >
                {session.status === 'continue' ? <Edit2 size={14} /> : <Play size={14} />}
                {session.status === 'continue' ? 'Continue' : 'Begin Session'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="fixed bottom-24 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all z-40 hover:brightness-110">
        <Plus size={24} />
      </button>
    </div>
  );
};

const LibraryScreen = () => {
  return (
    <div className="pt-28 pb-32 px-6 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-outline group-focus-within:accent-text transition-colors" size={18} />
          <input 
            className="w-full h-14 pl-14 pr-6 bg-white/5 border-white/5 rounded-2xl text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/30 transition-all text-xs tracking-wider font-light" 
            placeholder="FILTER BY ARTIST, STYLE OR REGION" 
            type="text" 
          />
        </div>
        <button className="h-14 px-8 glass-panel text-primary rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-white/5 active:scale-95 transition-all shrink-0">
          <FolderOpen size={18} />
          Import Collection
        </button>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center gap-3 w-max">
          {['ALL CURATED', 'PORTRAITS', 'LANDSCAPES', 'ANATOMY', 'BOTANICAL', 'ARCHITECTURAL'].map((cat, i) => (
            <button 
              key={cat} 
              className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] transition-all ${i === 0 ? 'bg-primary text-on-primary' : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {REFERENCES.map((ref) => (
          <div 
            key={ref.id} 
            className={`${ref.isFeatured ? 'col-span-2 row-span-2' : ''} group relative overflow-hidden rounded-3xl bg-surface-container cursor-pointer border border-white/5`}
          >
            <img 
              src={ref.image} 
              alt={ref.title} 
              className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${ref.isFeatured ? 'opacity-40 group-hover:opacity-100' : 'opacity-40 group-hover:opacity-100'}`} 
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-background to-transparent">
              <p className="text-[9px] font-bold text-primary uppercase mb-2 tracking-[0.3em]">{ref.category}</p>
              <h3 className={`${ref.isFeatured ? 'text-3xl font-light' : 'text-sm font-light'} text-on-surface tracking-tight group-hover:accent-text transition-colors`}>{ref.title}</h3>
            </div>
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full border border-primary/40 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <Plus size={20} className="text-primary" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

const SettingsScreen = () => {
  const [brightness, setBrightness] = useState(75);
  const [darkTheme, setDarkTheme] = useState(true);

  return (
    <div className="pt-28 pb-32 px-6 max-w-2xl mx-auto space-y-12">
      <section>
        <div className="glass-panel rounded-[2rem] p-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/40 p-1">
            <img 
              className="w-full h-full rounded-full object-cover shadow-lg" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZTsYp19vgWREWHRyRnVxbVUJWTXluiACchoaGNewni3v23f2Y8YFQ8ItzJfHvXxVcy-YItcTeOqgXtADGCkY5xp43sGVQI6fT18RUqZLTy15a8M1EccNpSyRC5uoAcXg03Hooa7gD1hDoIs8mpokffqMD4P1J66oNzsKO5pylWCcXUY5MXXEVHjaHJFzCQ1vjJy84eWhCNIfNMCMlP9PamZvjGZ1tYEge6MtU-2Vw9mRIzRD0saJO71OFLVtmVqarvzFXmWabKfM" 
              alt="Profile" 
            />
          </div>
          <div>
            <h2 className="text-2xl font-light text-on-surface tracking-tight">Julian Thorne</h2>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary opacity-60">Prestige Member</p>
          </div>
        </div>
      </section>

      <div className="space-y-10">
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-primary px-2 uppercase tracking-[0.3em] opacity-40">System Calibration</h3>
          <div className="glass-panel rounded-3xl overflow-hidden divide-y divide-white/5">
            <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="flex items-center gap-5">
                <Maximize2 size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-xs uppercase tracking-widest font-medium">Precision Focus</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Ultra-Mode</span>
                <ChevronRight size={14} className="text-on-surface-variant" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Sun size={18} className="text-on-surface-variant" />
                  <span className="text-xs uppercase tracking-widest font-medium">Luminance</span>
                </div>
                <span className="text-xs accent-text font-bold font-mono tracking-tighter">{brightness}%</span>
              </div>
              <input 
                className="w-full h-[3px] bg-white/10 rounded-full appearance-none cursor-pointer accent-primary" 
                type="range" 
                value={brightness} 
                onChange={(e) => setBrightness(parseInt(e.target.value))} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-primary px-2 uppercase tracking-[0.3em] opacity-40">Workspace Experience</h3>
          <div className="glass-panel rounded-3xl overflow-hidden divide-y divide-white/5">
            <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="flex items-center gap-5">
                <FlipHorizontal size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-xs uppercase tracking-widest font-medium">Coordinate Guide</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                <Play size={14} className="text-on-surface-variant group-hover:text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="py-2">
          <div className="glass-panel rounded-3xl p-6 flex items-center justify-between hover:bg-white/5 transition-all">
            <div className="flex items-center gap-5">
              <Moon size={18} className="text-on-surface-variant" />
              <span className="text-xs uppercase tracking-widest font-medium">Ambient Mask (Dark)</span>
            </div>
            <button 
              onClick={() => setDarkTheme(!darkTheme)}
              className={`w-12 h-6 rounded-full transition-colors relative ${darkTheme ? 'bg-primary' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${darkTheme ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <button className="w-full p-4 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-error hover:bg-error/5 rounded-2xl transition-colors">
            <LogOut size={16} />
            Terminate Session
          </button>
        </div>
      </div>

      <div className="mt-12 text-center space-y-2 opacity-30">
        <p className="text-[10px] font-medium tracking-widest">TRACE-CORE V.2.4.0-PRESTIGE</p>
        <p className="text-[8px] font-bold tracking-[0.4em] uppercase">Vanguard Creative Systems</p>
      </div>
    </div>
  );
};

const CameraScreen = ({ session }: { session?: Session }) => {
  const [opacity, setOpacity] = useState(40);
  const [zoom, setZoom] = useState(120);
  const [isLocked, setIsLocked] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
      }
    }
    setupCamera();
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 bg-surface-container-lowest">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''}`}
        />
        {!videoRef.current?.srcObject && (
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjvtxLKh0PHmRMzsHGYcaU2d5dY3by5dMKRr2vYa-a52l8BIz-_pzbVT0NwfSxINtr2gfaUDBV4issvcpaPuEqDTReQLNmvbOcz5jUKk8eUGRSmFLbU1bnfMRq51WySTRD0fEgeuHQemHvc2K4QZ36fsG-5i2Zc1D5OwX7ImbIqkrc1pyoFBw_J_rJVMvzf6aiNq43wymibBo2GbSNXiVT_xKAfSHwPAiH5uxJl5PCkGTCyNVuBtDtiScaqiANkzQJoOlguall-Cw" 
            className="w-full h-full object-cover opacity-50" 
            alt="Live Workspace Feed" 
          />
        )}
        
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
          style={{ opacity: opacity / 100 }}
        >
          <img 
            alt="Reference Overlay" 
            className="max-w-[80%] max-h-[80%] object-contain" 
            style={{ transform: `scale(${zoom / 100})` }}
            src={session?.refImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ8LizzxmKf5wsfzuqLrc7XJaAPpTG2JLLTQ988GB4J6P_4INSH5c0OIKlw61kACr0eyc3YRXMGnODCo8SFTyJA8jr3UbnmeMd5QBrlubDjnRHdcHKPgUS1cIoRA_H-FpG-IjzeYU950b3Bvl6Z0LoYpzIfcQYvhwIivLFHvHDN9kwEfr7YkSCeFLgpFpXjhrttaT6W7fxTBVgA8wx7uG_crhGmGpKCbDTme6936muWNNZ7PswgIM5w1PDixK5SGgkV_1RYYyvw6Q"} 
          />
        </div>

        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="border-r border-b border-white/40 last:border-0" />
          ))}
        </div>
      </div>

      <div className="fixed bottom-32 right-8 z-40 glass-panel rounded-full px-4 py-2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Live Session</span>
      </div>

      {isRecording && (
        <div className="fixed bottom-32 right-40 z-40 glass-panel rounded-full px-4 py-2 flex items-center gap-2 border-error/30">
          <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
          <span className="text-[10px] font-bold text-error uppercase tracking-tighter">REC</span>
          <span className="text-[10px] font-bold text-on-surface ml-1">00:45</span>
        </div>
      )}

      <aside className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-2 glass-panel rounded-2xl z-40">
        <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/20 text-primary active:scale-90 duration-150">
          <Edit2 size={24} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-white/10 active:scale-90 duration-150">
          <Eraser size={24} />
        </button>
        <div className="h-px w-8 mx-auto bg-white/10 my-1" />
        <button 
          onClick={() => setIsLocked(!isLocked)}
          className={`w-12 h-12 flex items-center justify-center rounded-xl active:scale-90 duration-150 ${isLocked ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:bg-white/10'}`}
        >
          <Lock size={24} />
        </button>
        <button 
          onClick={() => setIsMirrored(!isMirrored)}
          className={`w-12 h-12 flex items-center justify-center rounded-xl active:scale-90 duration-150 ${isMirrored ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:bg-white/10'}`}
        >
          <FlipHorizontal size={24} />
        </button>
      </aside>

      <aside className="fixed right-6 top-1/2 -translate-y-1/2 w-64 glass-panel rounded-3xl p-6 z-40 hidden md:block">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold text-outline uppercase tracking-widest">
              <span>Opacity</span>
              <span className="text-primary">{opacity}%</span>
            </div>
            <input 
              className="w-full h-1 bg-outline-variant rounded-full appearance-none cursor-pointer accent-primary" 
              type="range" 
              min="0" 
              max="100" 
              value={opacity} 
              onChange={(e) => setOpacity(parseInt(e.target.value))} 
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold text-outline uppercase tracking-widest">
              <span>Zoom Level</span>
              <span className="text-primary">{(zoom / 100).toFixed(1)}x</span>
            </div>
            <input 
              className="w-full h-1 bg-outline-variant rounded-full appearance-none cursor-pointer accent-primary" 
              type="range" 
              min="100" 
              max="400" 
              value={zoom} 
              onChange={(e) => setZoom(parseInt(e.target.value))} 
            />
          </div>
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Lock Position</span>
              <button 
                onClick={() => setIsLocked(!isLocked)}
                className={`w-12 h-6 rounded-full relative transition-colors ${isLocked ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isLocked ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mirror Image</span>
              <button 
                onClick={() => setIsMirrored(!isMirrored)}
                className={`w-12 h-6 rounded-full relative transition-colors ${isMirrored ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isMirrored ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4">
        <button className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(46,91,255,0.4)] active:scale-90 transition-all duration-150 group">
          <div className="w-16 h-16 rounded-full border-4 border-surface flex items-center justify-center">
            <Camera size={32} className="text-surface fill-surface" />
          </div>
        </button>
        <button 
          onClick={() => setIsRecording(!isRecording)}
          className={`w-16 h-16 rounded-full glass-panel flex items-center justify-center shadow-lg active:scale-90 transition-all duration-150 ${isRecording ? 'animate-pulse bg-error/20 border-error/30' : 'bg-white/10 border-white/20'}`}
        >
          <Video size={28} className={isRecording ? 'text-error' : 'text-on-surface'} />
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('HOME');
  const [activeSession, setActiveSession] = useState<Session | undefined>();

  const handleStartSession = (session: Session) => {
    setActiveSession(session);
    setView('CAMERA');
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/30 scrollbar-hide text-on-surface font-sans">
      <TopBar onViewChange={setView} />
      
      <main className="relative flex flex-col min-h-screen">
        <AnimatePresence mode="wait">
          {view === 'HOME' && (
            <motion.div 
              key="home" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1"
            >
              <HomeScreen onAction={handleStartSession} />
            </motion.div>
          )}
          {view === 'LIBRARY' && (
            <motion.div 
              key="library" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1"
            >
              <LibraryScreen />
            </motion.div>
          )}
          {view === 'SETTINGS' && (
            <motion.div 
              key="settings" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1"
            >
              <SettingsScreen />
            </motion.div>
          )}
          {view === 'CAMERA' && (
            <motion.div 
              key="camera" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <CameraScreen session={activeSession} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <NavBar currentView={view} onViewChange={setView} />
    </div>
  );
}
