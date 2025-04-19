import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SkillBarProps {
  name: string;
  level: number;
  color: 'primary' | 'secondary' | 'accent';
}

export default function SkillBar({ name, level, color }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  return (
    <div ref={ref} className="skill-container mb-4">
      <div className="flex justify-between mb-1">
        <span className={`font-orbitron text-${color}`}>{name}</span>
        <span className={`text-${color}`}>{level}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="skill-bar-fill h-full" 
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
