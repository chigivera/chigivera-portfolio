import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { services } from '../lib/constants';
import { Check } from 'lucide-react';

export default function Services() {
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
    <section id="services" ref={ref} className="py-20 bg-card relative">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-orbitron font-bold text-3xl md:text-5xl mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-foreground">MY </span>
          <span className="text-secondary neon-text-secondary">SERVICES</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={`bg-background p-6 rounded-lg border border-${service.color} hover:neon-border-${service.color} transition-all duration-300 transform hover:-translate-y-2`}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <div className={`text-${service.color} text-4xl mb-4`}>
                <i className={`fas fa-${service.icon}`}></i>
              </div>
              <h3 className="font-orbitron text-xl mb-3 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <ul className="text-muted-foreground space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <span className={`text-${service.color} mr-2`}>
                      <Check className="h-4 w-4" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
