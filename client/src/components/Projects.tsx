import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects } from '../lib/constants';
import PhoneModel from './PhoneModel';
import ServerRack from './ServerRack';
import { ExternalLink, Github } from 'lucide-react';

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  return (
    <section id="projects" ref={ref} className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-orbitron font-bold text-3xl md:text-5xl mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-accent neon-text-accent">PROJECT </span>
          <span className="text-foreground">SHOWCASE</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className={`project-card bg-background rounded-lg overflow-hidden border border-${project.color} hover:neon-border-${project.color} transition-all duration-300`}
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="relative">
                {project.isMobile ? (
                  <div className="h-64">
                    <PhoneModel />
                  </div>
                ) : project.isServer ? (
                  <div className="h-64">
                    <ServerRack />
                  </div>
                ) : (
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-64 object-cover"
                  />
                )}
                
                {project.isFeatured && (
                  <div className={`absolute top-0 right-0 bg-${project.color} text-${project.color}-foreground font-orbitron px-3 py-1`}>
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className={`font-orbitron text-xl mb-2 text-${project.color}`}>{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className={`px-2 py-1 bg-card text-${techIndex % 3 === 0 ? 'primary' : techIndex % 3 === 1 ? 'secondary' : 'accent'} text-xs rounded-md`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <a href={project.demoLink} className="text-primary hover:underline flex items-center">
                    <ExternalLink className="h-4 w-4 mr-1" /> Live Demo
                  </a>
                  <a href={project.codeLink} className="text-secondary hover:underline flex items-center">
                    <Github className="h-4 w-4 mr-1" /> Source Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
