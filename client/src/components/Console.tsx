import { useEffect, useRef, useState } from 'react';

interface ConsoleProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

// Simulated terminal commands and responses
const COMMANDS = [
  { command: "npm install", response: "Installing dependencies..." },
  { command: "git clone https://github.com/chigivera/project", response: "Cloning repository..." },
  { command: "npm run build", response: "Building project..." },
  { command: "docker-compose up", response: "Starting containers..." },
  { command: "npm test", response: "Running tests..." }
];

export default function Console({ width = 512, height = 300, onCanvasReady }: ConsoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [commandIndex, setCommandIndex] = useState(0);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Notify parent component that canvas is ready
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
    
    // Set up terminal appearance
    const terminalBg = '#111111';
    const terminalText = '#32F5FF';
    const promptColor = '#FF2CF5';
    
    // Animation frame ID for cleanup
    let animationId: number;
    
    // Terminal cursor position
    let cursorPos = 0;
    
    // Current command and response
    const command = COMMANDS[commandIndex].command;
    const response = COMMANDS[commandIndex].response;
    
    // Animation variables
    let isTypingCommand = true;
    let charIndex = 0;
    let responseShown = false;
    let lastTypingTime = 0;
    
    // Render loop
    const render = (timestamp: number) => {
      // Clear canvas
      ctx.fillStyle = terminalBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw terminal prompt
      ctx.font = '16px monospace';
      ctx.fillStyle = promptColor;
      ctx.fillText('user@portfolio:~$ ', 10, 30);
      
      // Type command character by character
      if (isTypingCommand) {
        if (timestamp - lastTypingTime > 100) { // Type a character every 100ms
          if (charIndex < command.length) {
            charIndex++;
            lastTypingTime = timestamp;
          } else {
            isTypingCommand = false;
            setTimeout(() => {
              responseShown = true;
            }, 500);
          }
        }
      }
      
      // Draw current command
      ctx.fillStyle = terminalText;
      ctx.fillText(command.substring(0, charIndex), 150, 30);
      
      // Add blinking cursor
      if (isTypingCommand && Math.floor(timestamp / 500) % 2 === 0) {
        ctx.fillRect(150 + ctx.measureText(command.substring(0, charIndex)).width, 17, 8, 16);
      }
      
      // Draw response
      if (responseShown) {
        ctx.fillText(response, 10, 60);
        
        // After showing response for a moment, move to next command
        if (timestamp - lastTypingTime > 2000) {
          setCommandIndex((prevIndex) => (prevIndex + 1) % COMMANDS.length);
          isTypingCommand = true;
          charIndex = 0;
          responseShown = false;
          lastTypingTime = timestamp;
        }
      }
      
      // Continue animation
      animationId = requestAnimationFrame(render);
    };
    
    // Start animation
    animationId = requestAnimationFrame(render);
    
    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [commandIndex, onCanvasReady]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      style={{ display: 'none' }} // Hide the actual canvas element
    />
  );
}