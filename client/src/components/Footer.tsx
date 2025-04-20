import { motion } from 'framer-motion';
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="py-10 bg-background border-t border-primary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-orbitron font-bold text-xl">
              <span className="text-primary neon-text-primary">AYMAN</span>
              <span className="text-secondary neon-text-secondary">.DEV</span>
            </h2>
          </motion.div>
          
          <motion.div 
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {["About", "Services", "Projects", "GitHub", "Contact"].map((item, index) => (
              <a 
                key={index}
                href={`#${item.toLowerCase()}`}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(`#${item.toLowerCase()}`)?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                {item.toUpperCase()}
              </a>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-muted-foreground text-center md:text-right text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>&copy; {new Date().getFullYear()} chigivera. All rights reserved.</p>
            <p className="mt-1">Crafted with <span className="text-secondary">♥</span> and cutting-edge technology</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
