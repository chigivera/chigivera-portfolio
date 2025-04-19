import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LaptopModel from './LaptopModel';
import { techStack } from '../lib/constants';
import { useTheme } from '../hooks/use-theme';

export default function Hero() {
  const { theme } = useTheme();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden py-20">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-2/5 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-orbitron font-bold text-4xl md:text-6xl mb-4 leading-tight">
              <span className="text-foreground">Senior</span>{' '}
              <span className="text-primary neon-text-primary">Software</span>{' '}
              <span className="text-secondary neon-text-secondary">Engineer</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              Specializing in web development, AI solutions, and data analysis
            </p>
            
            {/* Tech Stack Ribbons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {techStack.map((tech, index) => (
                <motion.div 
                  key={tech.name}
                  className={`tech-ribbon ${tech.color}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <i className={`fab fa-${tech.icon} mr-2`}></i>
                  {tech.name}
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.a 
                href="#contact" 
                className="px-8 py-3 bg-primary text-primary-foreground font-orbitron font-bold rounded-md hover:bg-white hover:text-background transition-colors text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                HIRE ME
              </motion.a>
              <motion.a 
                href="#projects" 
                className="px-8 py-3 border border-secondary text-secondary font-orbitron font-bold rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                MY WORK
              </motion.a>
            </div>
          </motion.div>
          
          {/* 3D Laptop Mockup */}
          <motion.div 
            className="md:w-3/5 perspective-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <LaptopModel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
