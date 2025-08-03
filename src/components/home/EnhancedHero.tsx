
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, BarChart2, ArrowRight, Shield, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const EnhancedHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative min-h-[90vh] hero-gradient overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-modern-blue-500/20 blur-3xl top-1/4 left-1/4 animate-blob"></div>
        <div className="absolute w-64 h-64 rounded-full bg-soft-purple/20 blur-3xl bottom-1/4 right-1/4 animate-blob" 
            style={{ animationDelay: '4s' }}></div>
        <div className="absolute w-80 h-80 rounded-full bg-soft-cyan/20 blur-3xl top-1/2 right-1/3 animate-blob"
            style={{ animationDelay: '8s' }}></div>
      </div>
      
      <motion.div 
        className="container max-w-7xl mx-auto px-4 py-24 relative z-10 flex flex-col lg:flex-row items-center gap-16"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div 
          className="w-full lg:w-1/2" 
          variants={itemVariants}
        >
          <Badge className="mb-4 bg-modern-blue-500/20 text-modern-blue-100 border-modern-blue-400/30 px-3 py-1">
            AI-POWERED CAREER SUITE
          </Badge>
          
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-gradient mb-6 font-sf-pro leading-tight">
            Your Career, <br />
            <span className="text-modern-blue-300">Evolved</span> & <span className="text-soft-purple">Secured</span>
          </h1>
          
          <p className="text-xl text-blue-100 max-w-xl mb-8 font-poppins">
            Merge the power of AI with blockchain security to build standout 
            resumes, verify credentials, and map your career journey with precision.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-modern-blue-500 to-modern-blue-600 hover:from-modern-blue-400 hover:to-modern-blue-500 text-white rounded-xl py-6 px-8"
            >
              <Link to="/builder" className="flex items-center gap-2">
                <FileText size={20} />
                <span className="font-medium">Build Your Resume</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 text-white rounded-xl py-6 px-8"
            >
              <Link to="/certification-center" className="flex items-center gap-2">
                <Shield size={20} />
                <span className="font-medium">Certifications</span>
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star key={rating} size={16} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <div className="text-blue-100 font-medium">
              Trusted by 10,000+ professionals
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="w-full lg:w-1/2 relative"
          variants={itemVariants}
        >
          <div className="relative z-10">
            <motion.div 
              className="glassmorphism rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden border-t border-l border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-modern-blue-500 flex items-center justify-center text-white">
                  <BarChart2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">ATS Score: 92%</h3>
                  <p className="text-blue-200">Your resume is optimized for ATS systems and stands out from 87% of applicants</p>
                </div>
              </div>
              <div className="h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full mt-4 w-[92%]"></div>
            </motion.div>
            
            <motion.div 
              className="glassmorphism-dark rounded-2xl p-6 max-w-[90%] ml-auto relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -top-2 -right-2 bg-soft-purple/80 text-white text-xs px-2 py-1 rounded-full">
                BLOCKCHAIN SECURED
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Verified Credentials</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield size={16} className="text-green-400" />
                  </div>
                  <div className="text-sm text-blue-200">
                    Web Development Certification
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield size={16} className="text-green-400" />
                  </div>
                  <div className="text-sm text-blue-200">
                    Data Science Specialization
                  </div>
                </div>
              </div>
              <Button 
                variant="link" 
                asChild 
                className="text-modern-blue-300 hover:text-modern-blue-200 p-0 mt-4"
              >
                <Link to="/blockchain-vault" className="flex items-center gap-1">
                  <span className="text-sm">View all credentials</span>
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </motion.div>
            
            {/* Floating elements */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-soft-cyan/10 backdrop-blur-3xl z-[-1] floating-element"></div>
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-soft-purple/10 backdrop-blur-3xl z-[-1] floating-element" 
                style={{ animationDelay: '2s' }}></div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[150%] h-20 text-white">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                className="fill-white dark:fill-gray-900"></path>
        </svg>
      </div>
    </div>
  );
};

export default EnhancedHero;
