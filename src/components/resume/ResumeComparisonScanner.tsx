
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const ResumeComparisonScanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create two document models (one for each resume)
    const resumeLeftGeometry = new THREE.BoxGeometry(2, 3, 0.05);
    const resumeRightGeometry = new THREE.BoxGeometry(2, 3, 0.05);
    
    const resumeLeftMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.5 
    });
    
    const resumeRightMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.5 
    });
    
    const resumeLeft = new THREE.Mesh(resumeLeftGeometry, resumeLeftMaterial);
    resumeLeft.position.x = -1.5;
    scene.add(resumeLeft);
    
    const resumeRight = new THREE.Mesh(resumeRightGeometry, resumeRightMaterial);
    resumeRight.position.x = 1.5;
    scene.add(resumeRight);
    
    // Add details to the resumes (text lines)
    const addTextLines = (resume: THREE.Mesh, offsetX: number) => {
      const linesGroup = new THREE.Group();
      for (let i = 0; i < 18; i++) {
        const lineGeometry = new THREE.BoxGeometry(1.6, 0.07, 0.01);
        const lineMaterial = new THREE.MeshBasicMaterial({ 
          color: i < 2 ? 0x4338ca : 0xcccccc 
        });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.y = 1.3 - (i * 0.15);
        line.position.z = 0.03;
        line.position.x = offsetX;
        line.scale.x = 0.5 + Math.random() * 0.5;
        linesGroup.add(line);
      }
      scene.add(linesGroup);
    };
    
    addTextLines(resumeLeft, -1.5);
    addTextLines(resumeRight, 1.5);
    
    // Create connecting lines between the resumes
    const connectingLines = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const lineGeometry = new THREE.BoxGeometry(3, 0.02, 0.01);
      const lineMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4338ca,
        transparent: true,
        opacity: 0.5 
      });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.position.y = 0.7 - (i * 0.4);
      line.position.z = 0.1;
      connectingLines.add(line);
    }
    scene.add(connectingLines);
    
    // Create scanner beam
    const scannerGeometry = new THREE.PlaneGeometry(5, 0.1);
    const scannerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const scanner = new THREE.Mesh(scannerGeometry, scannerMaterial);
    scanner.position.z = 0.2;
    scene.add(scanner);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 5);
    scene.add(directionalLight);
    
    // Add glowing accent lights
    const pointLight1 = new THREE.PointLight(0x4f46e5, 2, 10);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 10);
    pointLight2.position.set(-3, -2, 3);
    scene.add(pointLight2);
    
    // Position camera
    camera.position.z = 6;
    
    // Animation variables
    let scannerPosition = -1.5;
    let scannerDirection = 0.05;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Slowly rotate documents
      resumeLeft.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
      resumeRight.rotation.y = -Math.sin(Date.now() * 0.001) * 0.1;
      
      // Move scanner beam up and down
      scanner.position.y = scannerPosition;
      scannerPosition += scannerDirection;
      
      if (scannerPosition > 1.5 || scannerPosition < -1.5) {
        scannerDirection *= -1;
      }
      
      // Create pulse effect on connecting lines
      connectingLines.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshBasicMaterial;
          material.opacity = 0.3 + 0.3 * Math.sin(Date.now() * 0.003 + child.position.y * 0.5);
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  
  return (
    <div ref={containerRef} className="w-full h-[300px]"></div>
  );
};
