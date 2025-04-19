import { useRef, useEffect } from 'react';
import { useTheme } from '../hooks/use-theme';

export default function CircuitBackground() {
  const { theme } = useTheme();
  
  return (
    <div 
      className="circuit-pattern fixed inset-0 opacity-20 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
