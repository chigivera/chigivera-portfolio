import { useEffect, useRef, useState } from 'react';

interface ConsoleProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

// Custom terminal command to type "my name is ayman"
const COMMANDS = [
  { command: "echo \"my name is ayman\"", response: "my name is ayman" },
  { command: "whoami", response: "ayman" },
  { command: "ls -la ~/projects", response: "total 32\ndrwxr-xr-x  8 ayman  staff  256 Apr 19 12:34 .\ndrwxr-xr-x  5 ayman  staff  160 Apr 19 12:30 ..\ndrwxr-xr-x 12 ayman  staff  384 Apr 19 12:32 portfolio\ndrwxr-xr-x 14 ayman  staff  448 Apr 19 12:31 3d-engine\ndrwxr-xr-x 10 ayman  staff  320 Apr 19 12:33 neural-network" },
  { command: "cat ~/info.txt", response: "Name: Ayman\nRole: Senior Software Engineer\nSpecialty: 3D Web Applications" },
  { command: "echo \"Welcome to my portfolio\"", response: "Welcome to my portfolio" }
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
    
    // Set up terminal appearance with neon styling
    const terminalBg = '#0D0D0D';
    const terminalHeaderBg = '#1A1A1A';
    const terminalText = '#32F5FF';
    const terminalTextGlow = 'rgba(50, 245, 255, 0.7)';
    const promptColor = '#FF2CF5';
    const promptGlow = 'rgba(255, 44, 245, 0.7)';
    
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
      
      // Draw terminal header bar
      ctx.fillStyle = terminalHeaderBg;
      ctx.fillRect(0, 0, canvas.width, 20);
      
      // Draw terminal title in header
      ctx.font = '12px monospace';
      ctx.fillStyle = terminalText;
      ctx.fillText('DevPortfolio Terminal', 10, 14);
      
      // Draw terminal buttons in header
      ctx.fillStyle = '#FF5F56'; // Close button
      ctx.beginPath();
      ctx.arc(canvas.width - 50, 10, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FFBD2E'; // Minimize button
      ctx.beginPath();
      ctx.arc(canvas.width - 65, 10, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#27C93F'; // Maximize button
      ctx.beginPath();
      ctx.arc(canvas.width - 80, 10, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw terminal prompt with glow effect
      ctx.font = '16px monospace';
      
      // Add glow effect to prompt text
      ctx.shadowColor = promptGlow;
      ctx.shadowBlur = 5;
      ctx.fillStyle = promptColor;
      ctx.fillText('ayman@portfolio:~$ ', 10, 40);
      
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
      
      // Calculate prompt width
      const promptWidth = ctx.measureText('ayman@portfolio:~$ ').width;
      
      // Draw current command with glow effect
      ctx.shadowColor = terminalTextGlow;
      ctx.shadowBlur = 4;
      ctx.fillStyle = terminalText;
      ctx.fillText(command.substring(0, charIndex), promptWidth + 10, 40);
      
      // Add blinking cursor
      if (isTypingCommand && Math.floor(timestamp / 500) % 2 === 0) {
        // Reset shadow for the cursor
        ctx.shadowBlur = 0;
        ctx.fillRect(promptWidth + 10 + ctx.measureText(command.substring(0, charIndex)).width, 27, 8, 16);
      }
      
      // Draw response (handling multiline responses)
      if (responseShown) {
        // Add subtle glow to response text
        ctx.shadowColor = terminalTextGlow;
        ctx.shadowBlur = 3;
        
        const responseLines = response.split('\n');
        responseLines.forEach((line, index) => {
          ctx.fillText(line, 10, 70 + (index * 25));
        });
        
        // After showing response for a moment, move to next command
        if (timestamp - lastTypingTime > 2000) {
          setCommandIndex((prevIndex) => (prevIndex + 1) % COMMANDS.length);
          isTypingCommand = true;
          charIndex = 0;
          responseShown = false;
          lastTypingTime = timestamp;
        }
      }
      
      // Reset shadow for future rendering
      ctx.shadowBlur = 0;
      
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