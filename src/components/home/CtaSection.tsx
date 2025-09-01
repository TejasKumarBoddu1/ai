
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-purple-950 z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="container relative z-10">
        <div className="rounded-3xl overflow-hidden relative">
          {/* Gradient border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-50"></div>
          
          <div className="relative bg-black/40 backdrop-blur-xl p-12 md:p-20 rounded-3xl border border-white/10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                Ready to transform your job search?
              </h2>
              
              <p className="mx-auto text-lg text-indigo-200 mb-10 max-w-2xl">
                Join thousands of job seekers who've landed their dream jobs with QwiX CV's AI-powered platform. Start building your professional resume today.
              </p>
              
              <div className="space-y-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-lg px-8 py-6 hover:scale-105 transform rounded-xl group"
                >
                  <Link to="/builder" className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Build Your Resume Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <p className="text-gray-400 mt-4">
                  No credit card required. Start for free.
                </p>
              </div>
              
              {/* Floating elements for visual effect */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/30 blur-xl rounded-full"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-purple-500/30 blur-xl rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
