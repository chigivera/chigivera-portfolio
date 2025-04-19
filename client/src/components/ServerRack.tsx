import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createServerRackModel } from '../lib/3dUtils';
import { serverUnits } from '../lib/constants';

export default function ServerRack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rackRef = useRef<THREE.Group | null>(null);
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
    camera.position.set(0, 0, 6);
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
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Neon accent lights
    const blueLight = new THREE.PointLight(0x32F5FF, 1.5, 10);
    blueLight.position.set(2, 2, 2);
    scene.add(blueLight);
    
    const purpleLight = new THREE.PointLight(0x9B30FF, 1.5, 10);
    purpleLight.position.set(-2, -2, 2);
    scene.add(purpleLight);
    
    // Create server rack model
    const rack = createServerRackModel();
    rack.rotation.y = 0.3;
    scene.add(rack);
    rackRef.current = rack;
    
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
      if (!rackRef.current || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Rotate rack based on mouse position
      rackRef.current.rotation.y = 0.3 + x * 0.3;
      rackRef.current.rotation.x = 0 + y * 0.2;
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Add subtle movement
      if (rackRef.current) {
        rackRef.current.position.y = Math.sin(Date.now() * 0.0007) * 0.05;
      }
      
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
    <div ref={containerRef} className="w-full h-full min-h-[300px] perspective-container">
      {/* Three.js canvas will be appended here */}
      
      {/* Server unit labels */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-background bg-opacity-70 rounded-b-lg">
        <h3 className="font-orbitron text-primary text-center mb-2">Server Units</h3>
        <div className="grid grid-cols-2 gap-2">
          {serverUnits.map((unit, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 bg-${unit.color}-500`}></div>
              <span className="text-xs text-foreground">{unit.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
