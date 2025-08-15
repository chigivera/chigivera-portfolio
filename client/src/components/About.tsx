import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SkillBar from './SkillBar';
import NeuralNetwork from './NeuralNetwork';
import { skills } from '../lib/constants';

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  
  return (
    <section id="about" ref={ref} className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-orbitron font-bold text-3xl md:text-5xl mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary neon-text-primary">ABOUT</span>
          <span className="text-foreground"> ME</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.p 
              className="text-muted-foreground text-lg leading-relaxed"
              custom={0}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={variants}
            >
              Senior Software Engineer with over 8 years of experience building cutting-edge solutions across web development, AI integration, and data analysis. I specialize in creating scalable, performant applications that deliver exceptional user experiences.
            </motion.p>
            <motion.p 
              className="text-muted-foreground text-lg leading-relaxed"
              custom={1}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={variants}
            >
              My expertise spans full-stack development with a focus on React ecosystems, Python-based AI solutions, and cloud architecture. I'm passionate about leveraging technology to solve complex problems with elegant, efficient solutions.
            </motion.p>
            
            {/* Skill Bars */}
            <div className="space-y-4 mt-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  custom={index + 2}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={variants}
                >
                  <SkillBar 
                    name={skill.name} 
                    level={skill.level} 
                    color={skill.color as 'primary' | 'secondary' | 'accent'} 
                  />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Neural Network Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-[400px]"
          >
            <img src="/assets/upwork_profile.png" alt="Upwork Profile" className="w-full h-full object-cover rounded-lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
