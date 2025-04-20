import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ParticleBackground from '@/components/ParticleBackground';
import CircuitBackground from '@/components/CircuitBackground';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Github from '@/components/Github';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  // Script to handle smooth scroll behavior for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Cleanup event listener
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>chigivera - Senior Software Engineer Portfolio</title>
        <meta name="description" content="Portfolio website of a senior software engineer specializing in web development, AI, and data analysis." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </Helmet>
      
      {/* Background Elements */}
      <ParticleBackground count={150} />
      <CircuitBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        
        <main>
          <Hero />
          <About />
          <Services />
          <Projects />
          <Github />
          <Contact />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
