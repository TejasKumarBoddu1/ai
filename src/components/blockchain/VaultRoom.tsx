
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useBlockchain } from '@/context/BlockchainContext';
import { getUserDocuments } from '@/utils/blockchainDocuments';

export const VaultRoom: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { account } = useBlockchain();
  const animationRef = useRef<number>();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scene = new THREE.Scene();
    
    // Set background color to dark blue/purple
    scene.background = new THREE.Color(0x070a1a);
    
    // Add fog for depth effect
    scene.fog = new THREE.FogExp2(0x070a1a, 0.07);
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 8;
    camera.position.y = 1;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create room (vault)
    const roomGeometry = new THREE.BoxGeometry(14, 10, 16);
    const roomMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a20,
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.BackSide,
    });
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    scene.add(room);
    
    // Add grid floor
    const gridHelper = new THREE.GridHelper(14, 20, 0x00ffff, 0x00ffff);
    gridHelper.position.y = -5;
    scene.add(gridHelper);
    
    // Create document pillars or floating document cubes
    const documents = getUserDocuments();
    const documentItems = new THREE.Group();
    
    documents.forEach((doc, index) => {
      const documentSize = 0.75;
      const documentGeometry = new THREE.BoxGeometry(documentSize, documentSize * 1.3, 0.1);
      const documentMaterial = new THREE.MeshStandardMaterial({
        color: 0x4338ca,
        emissive: 0x4338ca,
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.2,
      });
      
      const document = new THREE.Mesh(documentGeometry, documentMaterial);
      
      // Position in a circular arrangement
      const angle = (index / documents.length) * Math.PI * 2;
      const radius = 5;
      document.position.x = Math.cos(angle) * radius;
      document.position.z = Math.sin(angle) * radius;
      document.position.y = Math.sin(index * 0.5) + 1;
      document.rotation.y = -angle + Math.PI / 2;
      
      // Edge glow effect
      const edges = new THREE.EdgesGeometry(documentGeometry);
      const edgesMaterial = new THREE.LineBasicMaterial({ 
        color: 0x4f46e5,
        linewidth: 1
      });
      const edgeLines = new THREE.LineSegments(edges, edgesMaterial);
      document.add(edgeLines);
      
      documentItems.add(document);
    });
    
    scene.add(documentItems);
    
    // Create central podium or platform
    const podiumGeometry = new THREE.CylinderGeometry(1.5, 2, 0.5, 16);
    const podiumMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3,
    });
    const podium = new THREE.Mesh(podiumGeometry, podiumMaterial);
    podium.position.y = -4.75;
    scene.add(podium);
    
    // Create holographic display above podium
    const holoGeometry = new THREE.SphereGeometry(0.9, 32, 32);
    const holoMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.6,
    });
    const hologram = new THREE.Mesh(holoGeometry, holoMaterial);
    hologram.position.y = 0;
    scene.add(hologram);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x0a0a30, 0.5);
    scene.add(ambientLight);
    
    const primaryLight = new THREE.PointLight(0x4f46e5, 2, 15);
    primaryLight.position.set(0, 5, 0);
    scene.add(primaryLight);
    
    const secondaryLight = new THREE.PointLight(0x00bfff, 1.5, 20);
    secondaryLight.position.set(-8, 2, -3);
    scene.add(secondaryLight);
    
    const tertiaryLight = new THREE.PointLight(0x38bdf8, 1.5, 20);
    tertiaryLight.position.set(8, 0, -5);
    scene.add(tertiaryLight);
    
    // Add animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate document items
      documentItems.rotation.y += 0.002;
      
      // Make documents float up and down slightly
      documentItems.children.forEach((child, index) => {
        child.position.y = Math.sin((Date.now() + index * 500) * 0.001) * 0.2 + 1;
      });
      
      // Pulse hologram
      hologram.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.05);
      hologram.material.opacity = 0.3 + Math.sin(Date.now() * 0.001) * 0.15;
      hologram.rotation.y += 0.01;
      
      // Camera slight movement
      camera.position.x = Math.sin(Date.now() * 0.0005) * 1.5;
      camera.position.z = 8 + Math.cos(Date.now() * 0.0005) * 1;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [account]);
  
  return (
    <div className="vault-room-container">
      <div ref={containerRef} className="w-full h-[400px] rounded-lg overflow-hidden border border-border"></div>
      <p className="text-center text-xs text-muted-foreground mt-2">
        Interact: Click and drag to rotate the view
      </p>
    </div>
  );
};
