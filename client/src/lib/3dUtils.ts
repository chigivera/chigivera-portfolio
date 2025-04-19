import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Initialize a Three.js scene
export const initScene = (container: HTMLElement): THREE.Scene => {
  const scene = new THREE.Scene();
  return scene;
};

// Create a camera
export const createCamera = (
  aspectRatio: number,
  fov: number = 75,
  near: number = 0.1,
  far: number = 1000
): THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  return camera;
};

// Create a renderer
export const createRenderer = (
  width: number,
  height: number
): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer;
};

// Create basic lighting
export const createLights = (scene: THREE.Scene): void => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Point lights with neon colors
  const blueLight = new THREE.PointLight(0x32F5FF, 1, 100);
  blueLight.position.set(2, 2, 2);
  scene.add(blueLight);

  const magentaLight = new THREE.PointLight(0xFF2CF5, 1, 100);
  magentaLight.position.set(-2, 2, 2);
  scene.add(magentaLight);

  const purpleLight = new THREE.PointLight(0x9B30FF, 1, 100);
  purpleLight.position.set(0, -2, 2);
  scene.add(purpleLight);
};

// Create a simple laptop model
export const createLaptopModel = (): THREE.Group => {
  const laptop = new THREE.Group();

  // Create laptop base
  const baseGeometry = new THREE.BoxGeometry(3, 0.2, 2);
  const baseMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x222222, 
    emissive: 0x222222,
    specular: 0x444444,
    shininess: 100
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  laptop.add(base);

  // Create laptop screen
  const screenGeometry = new THREE.BoxGeometry(3, 2, 0.1);
  const screenMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x222222, 
    emissive: 0x222222,
    specular: 0x444444,
    shininess: 100
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(0, 1.1, -1);
  screen.rotation.x = -Math.PI / 6;
  laptop.add(screen);

  // Create laptop screen display
  const displayGeometry = new THREE.PlaneGeometry(2.8, 1.8);
  const displayMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x32F5FF, 
    emissive: 0x32F5FF,
    opacity: 0.8,
    transparent: true
  });
  const display = new THREE.Mesh(displayGeometry, displayMaterial);
  display.position.set(0, 0, 0.06);
  screen.add(display);

  // Create laptop keyboard
  const keyboardGeometry = new THREE.PlaneGeometry(2.8, 1.8);
  const keyboardMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x333333
  });
  const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
  keyboard.position.set(0, 0.11, 0);
  keyboard.rotation.x = -Math.PI / 2;
  base.add(keyboard);

  return laptop;
};

// Create a simple smartphone model
export const createPhoneModel = (): THREE.Group => {
  const phone = new THREE.Group();

  // Create phone body
  const bodyGeometry = new THREE.BoxGeometry(1, 2, 0.1);
  const bodyMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x222222, 
    emissive: 0x222222,
    specular: 0x444444,
    shininess: 100
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  phone.add(body);

  // Create phone screen
  const screenGeometry = new THREE.PlaneGeometry(0.9, 1.8);
  const screenMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xFF2CF5, 
    emissive: 0xFF2CF5,
    opacity: 0.8,
    transparent: true
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(0, 0, 0.06);
  body.add(screen);

  // Create camera circle
  const cameraGeometry = new THREE.CircleGeometry(0.1, 32);
  const cameraMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const camera = new THREE.Mesh(cameraGeometry, cameraMaterial);
  camera.position.set(0, 0.8, 0.06);
  body.add(camera);

  // Create home button
  const homeGeometry = new THREE.CircleGeometry(0.1, 32);
  const homeMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
  const home = new THREE.Mesh(homeGeometry, homeMaterial);
  home.position.set(0, -0.8, 0.06);
  body.add(home);

  return phone;
};

// Create a simple server rack model
export const createServerRackModel = (): THREE.Group => {
  const rack = new THREE.Group();

  // Create rack enclosure
  const rackGeometry = new THREE.BoxGeometry(3, 4, 1);
  const rackMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x333333, 
    opacity: 0.8,
    transparent: true
  });
  const rackEnclosure = new THREE.Mesh(rackGeometry, rackMaterial);
  rack.add(rackEnclosure);

  // Create server units
  const colors = [0x32F5FF, 0x9B30FF, 0xFF2CF5, 0xFF5733, 0x33FF57];
  
  for (let i = 0; i < 5; i++) {
    const serverGeometry = new THREE.BoxGeometry(2.8, 0.6, 0.9);
    const serverMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x111111,
      specular: 0x222222,
      shininess: 30
    });
    const server = new THREE.Mesh(serverGeometry, serverMaterial);
    server.position.y = 1.5 - i * 0.7;
    rackEnclosure.add(server);
    
    // Add server front panel with LED
    const panelGeometry = new THREE.PlaneGeometry(2.7, 0.5);
    const panelMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x222222
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.z = 0.46;
    server.add(panel);
    
    // Add LEDs to server
    const ledGeometry = new THREE.CircleGeometry(0.05, 16);
    const ledMaterial = new THREE.MeshBasicMaterial({ 
      color: colors[i % colors.length],
      emissive: colors[i % colors.length]
    });
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.set(-1.2, 0, 0.01);
    panel.add(led);
  }

  return rack;
};

// Create neural network visualization
export const createNeuralNetwork = (scene: THREE.Scene): void => {
  const nodes = [];
  const connections = [];
  
  // Create layers of neurons
  const layers = [5, 8, 8, 3];
  const layerDistance = 2;
  const nodeSpacing = 0.6;
  
  // Create nodes
  for (let l = 0; l < layers.length; l++) {
    const layerNodes = [];
    const nodesInLayer = layers[l];
    const xPos = (l - (layers.length - 1) / 2) * layerDistance;
    
    for (let n = 0; n < nodesInLayer; n++) {
      const yPos = (n - (nodesInLayer - 1) / 2) * nodeSpacing;
      
      const geometry = new THREE.SphereGeometry(0.1, 16, 16);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x32F5FF,
        emissive: 0x32F5FF,
        transparent: true,
        opacity: 0.8
      });
      
      const node = new THREE.Mesh(geometry, material);
      node.position.set(xPos, yPos, 0);
      scene.add(node);
      
      layerNodes.push(node);
      nodes.push(node);
    }
    
    // Connect to previous layer
    if (l > 0) {
      const prevLayerNodes = nodes.slice(nodes.length - layerNodes.length - layers[l-1], nodes.length - layerNodes.length);
      
      for (const currentNode of layerNodes) {
        for (const prevNode of prevLayerNodes) {
          const startPoint = prevNode.position;
          const endPoint = currentNode.position;
          
          const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
          const length = direction.length();
          
          const geometry = new THREE.CylinderGeometry(0.01, 0.01, length, 8);
          
          // Randomize connection color
          const colors = [0x32F5FF, 0xFF2CF5, 0x9B30FF];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          const material = new THREE.MeshBasicMaterial({ 
            color,
            transparent: true,
            opacity: 0.4
          });
          
          const connection = new THREE.Mesh(geometry, material);
          
          // Position and orient the cylinder
          connection.position.copy(startPoint);
          connection.position.lerp(endPoint, 0.5);
          connection.lookAt(endPoint);
          connection.rotateX(Math.PI / 2);
          
          scene.add(connection);
          connections.push(connection);
        }
      }
    }
  }
  
  return { nodes, connections };
};

// Create circuit patterns on a plane
export const createCircuitPattern = (width: number, height: number): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(width, height);
  
  // Create a canvas for the circuit texture
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  
  if (ctx) {
    // Fill background
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = "rgba(50, 245, 255, 0.2)";
    ctx.lineWidth = 1;
    
    const gridSize = 32;
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw nodes at intersections
    ctx.fillStyle = "rgba(50, 245, 255, 0.5)";
    for (let x = 0; x <= canvas.width; x += gridSize) {
      for (let y = 0; y <= canvas.height; y += gridSize) {
        // Only draw some nodes for sparse effect
        if (Math.random() > 0.7) {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    // Draw random circuit paths
    ctx.strokeStyle = "rgba(155, 48, 255, 0.3)";
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 20; i++) {
      const startX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
      const startY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      let currentX = startX;
      let currentY = startY;
      
      // Create a random path
      const steps = Math.floor(Math.random() * 5) + 3;
      for (let s = 0; s < steps; s++) {
        const direction = Math.floor(Math.random() * 4);
        
        switch (direction) {
          case 0: // up
            currentY -= gridSize;
            break;
          case 1: // right
            currentX += gridSize;
            break;
          case 2: // down
            currentY += gridSize;
            break;
          case 3: // left
            currentX -= gridSize;
            break;
        }
        
        // Keep within bounds
        currentX = Math.max(0, Math.min(canvas.width, currentX));
        currentY = Math.max(0, Math.min(canvas.height, currentY));
        
        ctx.lineTo(currentX, currentY);
      }
      
      ctx.stroke();
    }
  }
  
  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  
  return new THREE.Mesh(geometry, material);
};

// Create animated particles
export const createParticles = (count: number, radius: number): THREE.Points => {
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  const color1 = new THREE.Color(0x32F5FF);
  const color2 = new THREE.Color(0xFF2CF5);
  const color3 = new THREE.Color(0x9B30FF);
  
  for (let i = 0; i < count; i++) {
    // Random position within a sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    
    // Random velocities
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    
    // Random colors among our neon palette
    const colorChoice = Math.floor(Math.random() * 3);
    let color;
    
    if (colorChoice === 0) color = color1;
    else if (colorChoice === 1) color = color2;
    else color = color3;
    
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Create particle material
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  return new THREE.Points(particleGeometry, particleMaterial);
};

// Update particle positions for animation
export const animateParticles = (particles: THREE.Points, delta: number, mousePosition?: THREE.Vector2): void => {
  const positions = particles.geometry.attributes.position.array as Float32Array;
  const velocities = particles.geometry.attributes.velocity.array as Float32Array;
  
  for (let i = 0; i < positions.length; i += 3) {
    // Update position by velocity
    positions[i] += velocities[i] * delta;
    positions[i + 1] += velocities[i + 1] * delta;
    positions[i + 2] += velocities[i + 2] * delta;
    
    // Apply mouse influence if available
    if (mousePosition) {
      const distance = Math.sqrt(
        Math.pow(positions[i] - mousePosition.x, 2) +
        Math.pow(positions[i + 1] - mousePosition.y, 2)
      );
      
      if (distance < 2) {
        const influence = (2 - distance) * 0.01;
        positions[i] += (mousePosition.x - positions[i]) * influence;
        positions[i + 1] += (mousePosition.y - positions[i + 1]) * influence;
      }
    }
    
    // Boundary checking - wrap around if too far
    const maxRadius = 10;
    const distanceFromCenter = Math.sqrt(
      positions[i] * positions[i] +
      positions[i + 1] * positions[i + 1] +
      positions[i + 2] * positions[i + 2]
    );
    
    if (distanceFromCenter > maxRadius) {
      // Reset to opposite side
      positions[i] *= -0.9;
      positions[i + 1] *= -0.9;
      positions[i + 2] *= -0.9;
    }
  }
  
  particles.geometry.attributes.position.needsUpdate = true;
};
