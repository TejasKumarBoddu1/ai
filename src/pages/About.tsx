
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Award, BookOpen, Bot, Brain, Briefcase, Code, Cpu, Database, 
  FileText, GraduationCap, Globe, HeartHandshake, Rocket, 
  Server, Sparkles, User
} from "lucide-react";

const About = () => {
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-modern-blue-600 to-soft-purple text-white">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute w-20 h-20 rounded-full bg-white/30 blur-xl top-1/4 left-1/4 animate-pulse"></div>
          <div className="absolute w-32 h-32 rounded-full bg-white/20 blur-xl top-2/3 left-2/3 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-24 h-24 rounded-full bg-white/25 blur-xl top-1/3 left-3/4 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 px-6 py-1 bg-white/20 text-white hover:bg-white/30">About QwiXEd360°Suite</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Careers with AI & Innovation</h1>
            <p className="text-lg text-white/90 mb-8">
              QwiXEd360°Suite is a comprehensive career development platform that combines AI, 
              blockchain, and precision tools to help you advance in your professional journey.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-modern-blue-600 hover:bg-white/90">
                <Link to="/">Explore Solutions</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-4 px-4 py-1 text-modern-blue-600 border-modern-blue-200">Our Story</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Birth of QwiXEd360°Suite</h2>
              <div className="space-y-6 text-gray-700">
                <p className="text-lg">
                  QwiXEd360°Suite emerged as a bold initiative to push the boundaries of AI, career development, and blockchain technology. 
                  Founded by a team of passionate technologists and researchers led by Dhadi Sai Praneeth Reddy, 
                  we set out to create solutions that harness the power of artificial intelligence to solve 
                  real-world career challenges.
                </p>
                <p className="text-lg">
                  What began as a small AI research project quickly evolved into a comprehensive career platform 
                  with ambitious goals. Our team's unwavering commitment to innovation and excellence 
                  has driven us to develop groundbreaking solutions across resume building, interview preparation, 
                  career guidance, and certification.
                </p>
                <p className="text-lg">
                  Today, QwiXEd360°Suite stands at the forefront of career technology innovation, constantly pushing the limits 
                  of what's possible and reimagining how technology can enhance career opportunities and 
                  transform industries.
                </p>
                <div className="py-2">
                  <Card className="bg-gradient-to-r from-modern-blue-50 to-purple-50 border-0 shadow-md">
                    <CardContent className="p-6">
                      <p className="text-xl italic text-gray-800 font-medium">
                        "To redefine career development through AI-driven technology by developing innovative, 
                        intelligent, and accessible solutions that transform job search and empower professionals."
                      </p>
                      <p className="mt-4 text-modern-blue-600 font-medium">— Our Vision</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl relative bg-gradient-to-r from-modern-blue-500 to-soft-purple p-1">
                <div className="bg-white h-full w-full rounded-xl p-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-modern-blue-100 mr-4">
                        <Bot className="h-6 w-6 text-modern-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">AI-First Approach</h3>
                        <p className="text-gray-600">We integrate artificial intelligence at the core of everything we build, creating intelligent systems that learn and evolve.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mr-4">
                        <Sparkles className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Innovation-Driven</h3>
                        <p className="text-gray-600">Our team continuously explores new technologies and methodologies to deliver groundbreaking career solutions.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mr-4">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Quality Excellence</h3>
                        <p className="text-gray-600">We uphold the highest standards in our development process, ensuring reliable and secure products.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mr-4">
                        <Rocket className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Career Advancement Focus</h3>
                        <p className="text-gray-600">Every feature and tool we create is designed with one goal: to help you advance in your professional journey.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 bg-white p-4 rounded-full shadow-lg border-2 border-modern-blue-100 w-20 h-20 flex items-center justify-center">
                <div className="text-2xl font-bold text-modern-blue-600">2023</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1">Our Leadership</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Visionary</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The talented mind behind QwiXEd360°Suite's innovative solutions and forward-thinking strategy.
            </p>
          </div>
          
          <div className="flex justify-center">
            <motion.div 
              className="flex flex-col items-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-48 h-48 rounded-full mb-6 overflow-hidden border-4 border-modern-blue-200 shadow-xl">
                <img 
                  src="/lovable-uploads/f5d06c81-a24b-4c51-8bf0-c6fd139438e3.png" 
                  alt="Dhadi Sai Praneeth Reddy" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">Dhadi Sai Praneeth Reddy</h3>
              <p className="text-modern-blue-600 mb-3">Founder & CTO</p>
              <p className="text-center text-gray-600 mb-4">
                Visionary technologist combining AI expertise with a passion for creating solutions that address real-world career challenges and empower professionals in their journey.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.234.585 1.8 1.15.566.566.902 1.132 1.152 1.8.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.8c-.566.566-1.132.902-1.8 1.152-.636.247-1.363.416-2.427.465-1.1.048-1.417.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.8-1.153 4.902 4.902 0 01-1.152-1.8c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.8A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="py-20 bg-modern-blue-600 text-white">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1 bg-white/20 text-white hover:bg-white/30">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Drives Us Forward</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              The core principles that guide everything we do at QwiXEd360°Suite.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white/10 p-8 rounded-xl border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 mb-6">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation First</h3>
              <p className="text-white/80">
                We continuously push boundaries, embrace challenges, and create solutions that redefine what's possible in career development technology.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 p-8 rounded-xl border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 mb-6">
                <HeartHandshake className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">User-Centric Design</h3>
              <p className="text-white/80">
                We place users at the center of everything we create, ensuring our solutions are intuitive, accessible, and truly beneficial for career advancement.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 p-8 rounded-xl border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 mb-6">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Impact</h3>
              <p className="text-white/80">
                We strive to create solutions that have a positive impact on professionals' lives worldwide, regardless of their background or location.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-gradient-to-r from-modern-blue-50 to-purple-50 rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-modern-blue-200/40 to-purple-200/40 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-modern-blue-200/40 to-purple-200/40 rounded-full translate-y-1/2 -translate-x-1/3"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
              <p className="text-lg text-gray-700 mb-8">
                Let's work together to advance your professional journey with our AI-powered tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-modern-blue-600 hover:bg-modern-blue-700">
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/pricing">View Solutions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
