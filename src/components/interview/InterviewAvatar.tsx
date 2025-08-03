
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface InterviewAvatarProps {
  isActive: boolean;
}

const InterviewAvatar: React.FC<InterviewAvatarProps> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    animationFrameId?: number;
    ambientLight?: THREE.AmbientLight;
    directionalLight?: THREE.DirectionalLight;
    table?: THREE.Mesh;
    plant?: THREE.Group;
    laptop?: THREE.Group;
    chair?: THREE.Group;
    avatar?: THREE.Group;
    office?: THREE.Group;
  }>({});
  
  // Set up and clean up the 3D scene
  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e); // Dark blue background
    
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 3);
    camera.lookAt(0, 1, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create a floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create a table (simple cube)
    const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, 0.75, -0.5);
    table.castShadow = true;
    table.receiveShadow = true;
    scene.add(table);
    
    // Table legs
    const legGeometry = new THREE.BoxGeometry(0.1, 0.75, 0.1);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x6b3300 });
    
    const createLeg = (x: number, z: number) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(x, 0.375, z);
      leg.castShadow = true;
      scene.add(leg);
    };
    
    // Add four legs to the table
    createLeg(0.9, 0);
    createLeg(-0.9, 0);
    createLeg(0.9, -1);
    createLeg(-0.9, -1);
    
    // Create a simple avatar (placeholder)
    // In a real implementation, we'd load a detailed 3D model
    const avatarGroup = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c27d });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.6;
    head.castShadow = true;
    avatarGroup.add(head);
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.25);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.1;
    body.castShadow = true;
    avatarGroup.add(body);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.1);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.3, 1.1, 0);
    rightArm.castShadow = true;
    avatarGroup.add(rightArm);
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.3, 1.1, 0);
    leftArm.castShadow = true;
    avatarGroup.add(leftArm);
    
    // Position avatar behind the table
    avatarGroup.position.z = -1.2;
    scene.add(avatarGroup);
    
    // Add laptop on table
    const laptopGroup = new THREE.Group();
    
    // Laptop base
    const baseGeometry = new THREE.BoxGeometry(0.6, 0.02, 0.4);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const laptopBase = new THREE.Mesh(baseGeometry, baseMaterial);
    laptopBase.castShadow = true;
    laptopGroup.add(laptopBase);
    
    // Laptop screen
    const screenGeometry = new THREE.BoxGeometry(0.55, 0.35, 0.02);
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const laptopScreen = new THREE.Mesh(screenGeometry, screenMaterial);
    laptopScreen.position.set(0, 0.17, -0.19);
    laptopScreen.rotation.x = Math.PI / 6;
    laptopScreen.castShadow = true;
    laptopGroup.add(laptopScreen);
    
    laptopGroup.position.set(0.5, 0.8, -0.3);
    scene.add(laptopGroup);
    
    // Add plant decoration
    const plantGroup = new THREE.Group();
    
    // Pot
    const potGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 16);
    const potMaterial = new THREE.MeshStandardMaterial({ color: 0xb35900 });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.castShadow = true;
    plantGroup.add(pot);
    
    // Plant leaves (simple shapes)
    const leafGeometry = new THREE.SphereGeometry(0.12, 8, 8);
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    
    const createLeaf = (x: number, y: number, z: number, scale: number) => {
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(x, y, z);
      leaf.scale.set(scale, scale, scale);
      leaf.castShadow = true;
      plantGroup.add(leaf);
    };
    
    createLeaf(0, 0.15, 0, 1);
    createLeaf(0.06, 0.22, 0.02, 0.8);
    createLeaf(-0.06, 0.22, 0.02, 0.7);
    createLeaf(0, 0.25, -0.05, 0.9);
    
    plantGroup.position.set(-0.7, 0.8, -0.3);
    scene.add(plantGroup);
    
    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      ambientLight,
      directionalLight,
      table,
      plant: plantGroup,
      laptop: laptopGroup,
      avatar: avatarGroup,
    };
    
    // Animation function
    const animate = () => {
      if (sceneRef.current.renderer && sceneRef.current.scene && sceneRef.current.camera) {
        // Add subtle animations here (e.g., avatar breathing, slight movements)
        if (sceneRef.current.avatar) {
          // Simulate breathing
          sceneRef.current.avatar.position.y = 0.005 * Math.sin(Date.now() * 0.001) + 0;
        }
        
        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      }
      
      sceneRef.current.animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (
        containerRef.current &&
        sceneRef.current.camera &&
        sceneRef.current.renderer
      ) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        sceneRef.current.camera.aspect = width / height;
        sceneRef.current.camera.updateProjectionMatrix();
        sceneRef.current.renderer.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current.animationFrameId !== undefined) {
        cancelAnimationFrame(sceneRef.current.animationFrameId);
      }
      
      if (sceneRef.current.renderer && containerRef.current) {
        containerRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
    };
  }, [isActive]);
  
  return <div ref={containerRef} className="w-full h-full" />;
};

export default InterviewAvatar;
