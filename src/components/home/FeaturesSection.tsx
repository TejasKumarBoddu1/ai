
import { useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileSearch, Layout, Sparkles, Zap, Award, Target, Briefcase } from "lucide-react";

const features = [
  {
    name: "AI-Powered Content Generation",
    description: "Our advanced AI assistant crafts perfect content for each section of your resume, tailored to your specific job targets.",
    icon: Brain,
    color: "from-purple-500 to-indigo-600"
  },
  {
    name: "ATS Optimization",
    description: "Built-in ATS compatibility ensures your resume passes through applicant tracking systems and reaches human recruiters.",
    icon: Target,
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: "Premium Templates",
    description: "Choose from a wide range of professionally designed templates that can be fully customized to match your personal style.",
    icon: Layout,
    color: "from-pink-500 to-rose-600"
  },
  {
    name: "Instant ATS Score Analysis",
    description: "Get real-time feedback on your resume's effectiveness with our comprehensive ATS scoring system.",
    icon: FileSearch,
    color: "from-amber-500 to-orange-600"
  },
  {
    name: "Job-Specific Recommendations",
    description: "Receive tailored suggestions based on your target job to maximize your chances of getting an interview.",
    icon: Briefcase,
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "One-Click Sharing",
    description: "Instantly share your resume with potential employers or download in multiple formats with a single click.",
    icon: Zap,
    color: "from-violet-500 to-purple-600"
  },
];

// Animation for the feature cards
const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
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
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
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
    <Card 
      ref={cardRef}
      className="overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-300 h-full"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transformStyle: 'preserve-3d'
      }}
    >
      <CardHeader>
        <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-4`}>
          <feature.icon className="w-7 h-7 text-white" />
        </div>
        <CardTitle className="text-xl text-white">{feature.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base text-gray-300">{feature.description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-indigo-950 z-0"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl top-1/4 -left-48 animate-blob"></div>
        <div className="absolute w-96 h-96 rounded-full bg-blue-600/20 blur-3xl top-3/4 left-1/3 animate-blob" style={{ animationDelay: '3s' }}></div>
        <div className="absolute w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl top-1/3 right-1/4 animate-blob" style={{ animationDelay: '6s' }}></div>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 mb-6">
            Features that transform your job search
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-indigo-200">
            Everything you need to create professional, ATS-friendly resumes that get you noticed and hired
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.name} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
