
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const templates = [
  {
    name: "Professional",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1470&auto=format&fit=crop",
    color: "from-blue-500 to-indigo-600"
  },
  {
    name: "Creative",
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=1000&auto=format&fit=crop",
    color: "from-pink-500 to-purple-600"
  },
  {
    name: "Minimalist",
    image: "https://images.unsplash.com/photo-1586282391848-2a53280a8a3e?q=80&w=1000&auto=format&fit=crop",
    color: "from-gray-500 to-slate-700"
  },
  {
    name: "Modern",
    image: "https://images.unsplash.com/photo-1676295439038-abf38d57f3fe?q=80&w=1000&auto=format&fit=crop",
    color: "from-teal-500 to-emerald-600"
  },
  {
    name: "Executive",
    image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format&fit=crop",
    color: "from-amber-500 to-orange-600"
  }
];

const TemplateCard = ({ template, index }: { template: typeof templates[0], index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group relative h-[480px] w-full flex flex-col items-center justify-center transition-all duration-500 ease-out rounded-xl overflow-hidden"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0">
        <img 
          src={template.image} 
          alt={template.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
      </div>
      
      <div className="relative z-10 p-6 text-center mt-auto">
        <h3 className="text-2xl font-bold text-white mb-2">{template.name}</h3>
        <div className="transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
          <Button asChild className={`bg-gradient-to-r ${template.color} hover:shadow-lg hover:shadow-purple-500/25 mt-4`}>
            <Link to="/builder">Customize Now</Link>
          </Button>
        </div>
      </div>
      
      {/* Template number */}
      <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white font-bold">
        Template {index + 1}
      </div>
    </div>
  );
};

const TemplatesShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const maxVisibleItems = 3;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % templates.length);
  };
  
  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + templates.length) % templates.length);
  };
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-indigo-950 z-0"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 mb-6">
            Premium Resume Templates
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-indigo-200">
            Choose from our collection of professionally designed templates to make your resume stand out
          </p>
        </div>
        
        <div className="relative px-12">
          {/* Navigation buttons */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full h-12 w-12"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full h-12 w-12"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          {/* Templates carousel */}
          <div 
            ref={containerRef} 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 ease-out"
          >
            {templates.map((template, index) => {
              const isVisible = (index >= activeIndex && index < activeIndex + maxVisibleItems) || 
                              (activeIndex + maxVisibleItems > templates.length && index < (activeIndex + maxVisibleItems) % templates.length);
              
              if (!isVisible && window.innerWidth >= 768) return null;
              
              return (
                <TemplateCard key={template.name} template={template} index={index} />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplatesShowcase;
