
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  onNavigate: (view: 'home' | 'blog' | 'admin' | 'projects', sectionId?: string) => void;
  currentView: 'home' | 'blog' | 'admin' | 'projects';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('portfolio_hero_dark') !== 'false');
  // True once the user has scrolled past the Hero — forces an opaque dark
  // navbar so white text stays readable over cream / white section backgrounds.
  // On non-home routes there is no Hero, so it's always "past" the hero.
  const [pastHero, setPastHero] = useState(() => location.pathname !== '/');

  useEffect(() => {
    const handler = () => setIsDark(localStorage.getItem('portfolio_hero_dark') !== 'false');
    window.addEventListener('portfolioThemeChange', handler);
    return () => window.removeEventListener('portfolioThemeChange', handler);
  }, []);

  // When the route changes, immediately sync pastHero:
  // non-home pages have no Hero so they always need the opaque bar.
  // The home page starts at the top (over the Hero) so reset to false.
  useEffect(() => {
    setPastHero(location.pathname !== '/');
  }, [location.pathname]);

  useEffect(() => {
    let ticking = false;
    const compute = () => {
      const currentScrollY = window.scrollY;

      // Once past ~80 % of the Hero height, the navbar floats over light
      // sections — lock it to an opaque dark style so text stays readable.
      const heroEl = document.querySelector('section') as HTMLElement | null;
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
      setPastHero(currentScrollY > heroHeight * 0.8);

      // Hide navbar if inside #projects section
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        const isInsideProjects = rect.top < window.innerHeight * 0.3 && rect.bottom > window.innerHeight * 0.3;
        if (isInsideProjects) {
          setIsVisible(false);
          setLastScrollY(currentScrollY);
          ticking = false;
          return;
        }
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(compute);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      // We need to wait for navigation to home before scrolling, 
      // effectively this is solved by passing the ID to parent or handling it via effect in Home/App
      // For now, I'll rely on the onNavigate prop passed from App which handles this logic perfectly
      onNavigate('home', id);
    } else {
      onNavigate('home', id);
    }
  };

  return (
    <nav className={`fixed top-4 sm:top-6 left-1/2 z-[110] w-[95%] sm:w-[90%] max-w-5xl transition-all duration-500 ease-in-out ${isVisible ? 'nav-visible' : 'nav-hidden'}`}>
      <div className={`backdrop-blur-md border-[3px] sm:border-[4px] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] sm:shadow-[8px_8px_0px_rgba(0,0,0,0.3)] px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-between ${
        // When over the dark Hero stay translucent; everywhere else (light
        // section backgrounds) use the opaque dark bar so text stays visible.
        !pastHero && isDark
          ? 'bg-white/10 border-white/30'
          : 'bg-black/90 border-black/60'
      }`}>
        <div
          className="text-2xl font-black tracking-tighter flex items-center gap-2 sm:gap-3 cursor-pointer group"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FFD600] border-2 sm:border-4 border-black rounded-full flex items-center justify-center font-black group-hover:rotate-12 transition-transform text-xs sm:text-base">
            MY
          </div>
          <span className="hidden sm:inline uppercase text-white">Manish Yadav</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 font-black uppercase text-[10px] sm:text-sm">
          <a
            href="/projects"
            onClick={(e) => {
              if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                onNavigate('projects');
              }
            }}
            className={`cursor-pointer hover:text-red-400 transition-colors uppercase font-black ${currentView === 'projects' ? 'text-red-400 underline decoration-4' : 'text-white'}`}
          >
            Projects
          </a>
          <a
            href="/blog"
            onClick={(e) => {
              // Allow middle-click and ctrl/cmd+click to work naturally
              if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                onNavigate('blog');
              }
            }}
            className={`cursor-pointer hover:text-green-400 transition-colors uppercase font-black ${currentView === 'blog' ? 'text-green-400 underline decoration-4' : 'text-white'}`}
          >
            Blog
          </a>
          <a
            href="#contact-banner"
            onClick={(e) => handleLinkClick(e, 'contact-banner')}
            className="cartoon-btn bg-black text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-none hover:bg-[#FFD600] hover:text-black shadow-none active:translate-y-1 whitespace-nowrap"
          >
            PING ME!
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
