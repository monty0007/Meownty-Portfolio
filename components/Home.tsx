import React, { useEffect } from 'react';
import Hero from './Hero';
import Projects from './Projects';
import Skills from './Skills';
import Arcade from './Arcade';
import Achievements from './Achievements';
import ContactForm from './ContactForm';

interface HomeProps {
    targetSection: string | null;
    setTargetSection: (section: string | null) => void;
}

const Home: React.FC<HomeProps> = ({ targetSection, setTargetSection }) => {

    useEffect(() => {
        if (targetSection) {
            const timer = setTimeout(() => {
                const element = document.getElementById(targetSection);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    setTargetSection(null);
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [targetSection, setTargetSection]);

    return (
        <>
            <Hero />

            <section id="about" className="px-6 bg-black border-b-8 border-[#FFD600] relative z-10 overflow-hidden">
                {/* Subtle dot grid */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }}
                />
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 py-20 relative z-10">
                    <div className="w-full md:w-1/3 aspect-square overflow-hidden rotate-[-3deg] hover:rotate-0 transition-transform bg-[#FF4B4B] border-4 border-[#FFD600] shadow-[8px_8px_0px_rgba(255,214,0,0.3)]">
                        <img
                            src="/weeww.webp"
                            alt="Manish Yadav"
                            width={534}
                            height={534}
                            fetchPriority="high"
                            loading="eager"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="inline-block px-5 py-2 bg-[#FFD600] text-black border-4 border-[#FFD600] font-black uppercase text-lg transform -rotate-1 shadow-[4px_4px_0px_rgba(255,214,0,0.3)]">
                                The Architect
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 bg-[#FF4B4B] border-2 border-white/20 rounded-full"></div>
                                <div className="w-3 h-3 bg-[#FFD600] border-2 border-white/20 rounded-full"></div>
                                <div className="w-3 h-3 bg-[#00A1FF] border-2 border-white/20 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white">
                            I build AI-powered systems that <span className="text-[#FFD600] underline decoration-8 decoration-[#FFD600]/40">simplify</span> work.
                        </p>
                        <p className="text-xl md:text-2xl font-medium text-white/60 leading-relaxed mb-8">
                            I design and connect intelligent workflows using Power Platform, GenAI, automation, and modern full-stack tools—turning complex logic into solutions that feel simple to use.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <span className="bg-white/10 text-white px-3 py-1.5 font-black uppercase text-xs border-2 border-white/20 hover:border-white/50 transition-colors">Power Platform</span>
                            <span className="bg-[#FF4B4B]/20 text-white px-3 py-1.5 font-black uppercase text-xs border-2 border-[#FF4B4B]/50 hover:border-[#FF4B4B] transition-colors">GenAI</span>
                            <span className="bg-[#00A1FF]/20 text-white px-3 py-1.5 font-black uppercase text-xs border-2 border-[#00A1FF]/50 hover:border-[#00A1FF] transition-colors">Agentic Workflows</span>
                            <span className="bg-[#FFD600]/20 text-[#FFD600] px-3 py-1.5 font-black uppercase text-xs border-2 border-[#FFD600]/50 hover:border-[#FFD600] transition-colors">Full-Stack</span>
                        </div>
                    </div>
                </div>
            </section>

            <Projects />

            <div className="bg-[#FFD600]/40 backdrop-blur-sm border-y-8 border-black">
                <Achievements />
            </div>

            <div className="bg-[#00A1FF]/40 backdrop-blur-sm">
                <Skills />
            </div>

            <Arcade />

            <section id="contact-banner" className="py-24 px-6 text-center bg-[#FF4B4B]/80 backdrop-blur-lg relative z-10 border-t-8 border-black text-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 leading-none tracking-tighter">
                        Deploy <br /> <span className="text-[#FFD600]" style={{ WebkitTextStroke: '2px black' }}>With Me</span>
                    </h2>

                    <ContactForm />

                    <div className="mt-20 flex flex-wrap justify-center gap-8 text-black font-black uppercase">
                        <div className="bg-white border-4 border-black px-6 py-2 rotate-1">Available 24/7</div>
                        <div className="bg-[#FFD600] border-4 border-black px-6 py-2 -rotate-1">Action Bastion Energy</div>
                        <div className="bg-[#00A1FF] text-white border-4 border-black px-6 py-2 rotate-2">22nd Century Tech</div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
