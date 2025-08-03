
import { CheckCircle2, FileText, Sparkles, Send } from "lucide-react";

const steps = [
  {
    title: "Create Your Profile",
    description: "Enter your personal details, experience, education, and skills into our intuitive interface.",
    icon: FileText,
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "AI Enhancement",
    description: "Our AI analyzes your inputs and suggests optimized content for each section of your resume.",
    icon: Sparkles,
    color: "from-purple-500 to-pink-400"
  },
  {
    title: "ATS Optimization",
    description: "Get real-time ATS score analysis to ensure your resume passes through applicant tracking systems.",
    icon: CheckCircle2,
    color: "from-green-500 to-emerald-400"
  },
  {
    title: "Apply With Confidence",
    description: "Export your polished resume, share it with employers, and land more interviews.",
    icon: Send,
    color: "from-amber-500 to-orange-400"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-gray-900 z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      {/* Dynamic grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }}></div>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 mb-6">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-indigo-200">
            Building a professional resume has never been easier. Complete these simple steps and be ready to apply in minutes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hidden lg:block"></div>
          
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="relative flex flex-col items-center text-center"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Step number circle */}
              <div className="relative z-20 mb-6">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-purple-500/20`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse opacity-70 blur-sm -z-10"></div>
              </div>
              
              {/* Step details */}
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-6 rounded-xl w-full">
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
