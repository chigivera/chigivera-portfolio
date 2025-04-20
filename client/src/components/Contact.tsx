import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import TerminalContact from './TerminalContact';
import { socialLinks } from '../lib/constants';
import { Mail, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <section id="contact" ref={ref} className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-orbitron font-bold text-3xl md:text-5xl mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-foreground">GET IN </span>
          <span className="text-secondary neon-text-secondary">TOUCH</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h3 
              className="font-orbitron text-2xl mb-6 text-primary"
              variants={itemVariants}
            >
              Let's Connect
            </motion.h3>
            
            <motion.p 
              className="text-muted-foreground mb-8"
              variants={itemVariants}
            >
              Ready to bring your project to life with cutting-edge technology? Reach out to discuss how we can create exceptional solutions together.
            </motion.p>
            
            <div className="space-y-6">
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
              >
                <div className="text-primary text-xl mr-4 mt-1">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-orbitron text-foreground">Email</h4>
                  <a href="mailto:contact@chigivera.dev" className="text-muted-foreground hover:text-primary transition-colors">
                    contact@chigivera.dev
                  </a>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
              >
                <div className="text-secondary text-xl mr-4 mt-1">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-orbitron text-foreground">Location</h4>
                  <p className="text-muted-foreground">San Francisco, California</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
              >
                <div className="text-accent text-xl mr-4 mt-1">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-orbitron text-foreground">Availability</h4>
                  <p className="text-muted-foreground">Open to freelance and consultation opportunities</p>
                </div>
              </motion.div>
            </div>
            
            {/* Social Links */}
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <h4 className="font-orbitron text-foreground mb-4">Connect on Social</h4>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <motion.a 
                    key={index}
                    href={link.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-card border border-${link.color} flex items-center justify-center text-${link.color} hover:bg-${link.color} hover:text-${link.color}-foreground transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className={`fab fa-${link.icon}`}></i>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Terminal Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TerminalContact />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
