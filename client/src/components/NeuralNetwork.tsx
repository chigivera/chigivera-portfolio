import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createNeuralNetwork } from '../lib/3dUtils';

export default function NeuralNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number | null>(null);
  
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
    camera.position.z = 5;
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Create neural network
    createNeuralNetwork(scene);
    
    // Group for rotation
    const networkGroup = new THREE.Group();
    scene.children.forEach(child => {
      scene.remove(child);
      networkGroup.add(child);
    });
    scene.add(networkGroup);
    
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
    
    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update network nodes based on mouse position
      networkGroup.rotation.y = x * 0.3;
      networkGroup.rotation.x = y * 0.2;
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Pulse the neural network nodes
      const time = Date.now() * 0.001;
      
      networkGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
          // It's a node (sphere)
          const scale = 0.8 + Math.sin(time + index * 0.2) * 0.2;
          child.scale.set(scale, scale, scale);
          
          // Adjust the opacity for pulsing effect
          if (child.material instanceof THREE.MeshBasicMaterial) {
            child.material.opacity = 0.5 + Math.sin(time + index * 0.2) * 0.3;
          }
        }
      });
      
      // Slowly rotate the network
      networkGroup.rotation.y += 0.001;
      
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
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[300px] border border-primary rounded-lg neon-border-primary overflow-hidden"
    >
      <div className="text-center p-4 font-orbitron text-secondary">
        AI NEURAL NETWORK
      </div>
      {/* Three.js canvas will be appended here */}
    </div>
  );
}
