import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { createLaptopModel } from '../lib/3dUtils';
import Console from './Console';

export default function LaptopModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const laptopRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [consoleReady, setConsoleReady] = useState(false);
  
  // Function to update laptop texture (using useCallback to ensure it's defined before use)
  const updateLaptopTexture = useCallback((texture: THREE.Texture) => {
    if (!laptopRef.current || !sceneRef.current) return;
    
    // Remove old laptop
    sceneRef.current.remove(laptopRef.current);
    
    // Create new laptop with the texture
    const laptop = createLaptopModel(texture);
    laptop.scale.set(1.5, 1.5, 1.5);
    laptop.rotation.x = 0.2;
    laptop.rotation.y = 0.5;
    sceneRef.current.add(laptop);
    laptopRef.current = laptop;
  }, []);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6); // Move camera back to accommodate larger laptop
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Neon accent lights
    const blueLight = new THREE.PointLight(0x32F5FF, 2, 10);
    blueLight.position.set(2, 2, 2);
    scene.add(blueLight);
    
    const purpleLight = new THREE.PointLight(0x9B30FF, 2, 10);
    purpleLight.position.set(-2, 0, 2);
    scene.add(purpleLight);
    
    // Initial laptop without texture (will be updated when console is ready)
    const laptop = createLaptopModel();
    
    // Make laptop bigger and position correctly
    laptop.scale.set(1.5, 1.5, 1.5);
    laptop.rotation.x = 0.2;
    laptop.rotation.y = 0.5;
    scene.add(laptop);
    laptopRef.current = laptop;
    
    // If we already have a texture from the console, update the model immediately
    if (textureRef.current) {
      updateLaptopTexture(textureRef.current);
    }
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Add hover effect
    const handleMouseMove = (event: MouseEvent) => {
      if (!laptopRef.current || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Rotate laptop based on mouse position
      laptopRef.current.rotation.y = 0.5 + x * 0.5;
      laptopRef.current.rotation.x = 0.2 + y * 0.2;
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !laptopRef.current) return;
      
      // Add floating animation
      laptopRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
      
      // Render
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Request next frame
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Handler for when Console canvas is ready
  const handleConsoleReady = (canvas: HTMLCanvasElement) => {
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    textureRef.current = texture;
    
    // Update the laptop texture using our updateLaptopTexture function
    updateLaptopTexture(texture);
    
    // Mark console as ready
    setConsoleReady(true);
  };
  
  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] perspective-container">
      {/* Three.js canvas will be appended here */}
      <Console width={512} height={300} onCanvasReady={handleConsoleReady} />
    </div>
  );
}
