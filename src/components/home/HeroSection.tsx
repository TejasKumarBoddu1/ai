
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Zap, BarChart2 } from "lucide-react";
import * as THREE from "three";

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    
    // Set renderer size to match container
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Create resume 3D object
    const resumeWidth = 2.1;
    const resumeHeight = 3;
    const resumeGeometry = new THREE.PlaneGeometry(resumeWidth, resumeHeight);
    
    // Create texture for resume
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 800;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Background
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Header
      context.fillStyle = '#0077FF';
      context.fillRect(0, 0, canvas.width, 120);
      
      // Name
      context.font = 'bold 36px SF Pro Display, Arial';
      context.fillStyle = '#ffffff';
      context.fillText('JOHN DOE', 50, 70);
      
      // Title
      context.font = '24px Poppins, Arial';
      context.fillStyle = '#e5e7eb';
      context.fillText('SOFTWARE ENGINEER', 50, 100);
      
      // Contact info
      context.font = '16px Poppins, Arial';
      context.fillStyle = '#0077FF';
      context.fillText('john.doe@example.com | (123) 456-7890', 50, 150);
      
      // Content sections
      context.fillStyle = '#111827';
      context.font = 'bold 20px SF Pro Display, Arial';
      context.fillText('EXPERIENCE', 50, 200);
      
      context.fillStyle = '#374151';
      context.font = '16px Poppins, Arial';
      context.fillText('Software Engineer at Tech Corp', 50, 230);
      context.font = '14px Poppins, Arial';
      context.fillText('2020 - Present', 50, 250);
      
      // Lines for text content
      context.fillStyle = '#9ca3af';
      for (let i = 0; i < 5; i++) {
        context.fillRect(50, 280 + (i * 20), 400, 2);
      }
      
      // Education section
      context.fillStyle = '#111827';
      context.font = 'bold 20px SF Pro Display, Arial';
      context.fillText('EDUCATION', 50, 400);
      
      context.fillStyle = '#374151';
      context.font = '16px Poppins, Arial';
      context.fillText('Bachelor of Science in Computer Science', 50, 430);
      context.font = '14px Poppins, Arial';
      context.fillText('University of Technology - 2019', 50, 450);
      
      // Skills section
      context.fillStyle = '#111827';
      context.font = 'bold 20px SF Pro Display, Arial';
      context.fillText('SKILLS', 50, 500);
      
      // Skill boxes
      const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS'];
      skills.forEach((skill, index) => {
        const x = 50 + (index % 3) * 150;
        const y = 530 + Math.floor(index / 3) * 40;
        
        const gradient = context.createLinearGradient(x, y, x + 120, y);
        gradient.addColorStop(0, '#0077FF');
        gradient.addColorStop(1, '#8B5CF6');
        
        context.fillStyle = gradient;
        context.fillRect(x, y, 120, 30);
        
        context.fillStyle = '#ffffff';
        context.font = '14px Poppins, Arial';
        context.fillText(skill, x + 10, y + 20);
      });
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    
    // Material with the resume texture
    const resumeMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    
    // Create mesh and add to scene
    const resumeMesh = new THREE.Mesh(resumeGeometry, resumeMaterial);
    scene.add(resumeMesh);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate resume with smooth animation
      resumeMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
      resumeMesh.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', updateSize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-[90vh] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-modern-blue-800 via-modern-blue-700 to-soft-purple z-0"></div>
      
      {/* Animated particles background */}
      <div className="absolute inset-0 z-10 opacity-30">
        <div className="absolute w-20 h-20 rounded-full bg-soft-cyan blur-xl top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute w-32 h-32 rounded-full bg-soft-purple blur-xl top-2/3 left-2/3 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-24 h-24 rounded-full bg-modern-blue-500 blur-xl top-1/3 left-3/4 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-16 h-16 rounded-full bg-soft-cyan blur-xl top-3/4 left-1/4 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="container relative z-20 mx-auto flex flex-col lg:flex-row items-center h-full py-20">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 animate-fade-in font-sf-pro">
            AI-Enhanced Resumes, Built for Success
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-blue-100 max-w-lg animate-fade-in font-poppins" style={{ animationDelay: '0.2s' }}>
            Our AI-powered resume builder crafts ATS-optimized professional resumes 
            that help you stand out and land interviews faster.
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              asChild 
              size="xl" 
              variant="gradient"
              className="rounded-xl py-6 text-lg"
            >
              <Link to="/builder">
                <FileText className="mr-2 h-5 w-5" />
                Build Your Resume
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="xl" 
              variant="glass"
              className="rounded-xl py-6 text-lg"
            >
              <Link to="/ats-scanner">
                <BarChart2 className="mr-2 h-5 w-5" />
                ATS Scanner
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-modern-blue-200 flex items-center justify-center border-2 border-white">
                <span className="text-xs font-medium text-modern-blue-700">98%</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center border-2 border-white">
                <span className="text-xs font-medium text-green-700">ATS</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center border-2 border-white">
                <span className="text-xs font-medium text-purple-700">AI</span>
              </div>
            </div>
            <p className="text-sm text-blue-100 font-poppins">
              <span className="font-semibold">10,000+</span> professionals improved their interview chances
            </p>
          </div>
        </div>
        
        <div ref={containerRef} className="w-full lg:w-1/2 h-[400px] lg:h-[500px] relative">
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
          <div className="absolute bottom-5 right-5 glassmorphism-dark text-white p-3 rounded-lg text-sm animate-bounce-soft">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-soft-cyan" />
              <span className="font-poppins">AI-optimized for ATS</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Glassmorphism cards floating in background */}
      <div className="absolute bottom-10 right-10 w-64 h-40 glassmorphism rounded-2xl border border-white/20 shadow-xl animate-float z-10"></div>
      <div className="absolute top-20 right-20 w-48 h-48 glassmorphism-dark rounded-2xl border border-white/10 shadow-xl animate-float z-10" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default HeroSection;
